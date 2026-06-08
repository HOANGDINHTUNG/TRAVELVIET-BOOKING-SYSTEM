package com.wedservice.backend.module.hotels.service;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.common.response.PageResponse;
import com.wedservice.backend.module.destinations.entity.Destination;
import com.wedservice.backend.module.destinations.repository.DestinationRepository;
import com.wedservice.backend.module.hotels.dto.request.HotelRequest;
import com.wedservice.backend.module.hotels.dto.request.HotelSearchRequest;
import com.wedservice.backend.module.hotels.dto.response.HotelResponse;
import com.wedservice.backend.module.hotels.entity.Hotel;
import com.wedservice.backend.module.hotels.entity.HotelRoomInventory;
import com.wedservice.backend.module.hotels.entity.HotelRoomType;
import com.wedservice.backend.module.hotels.entity.QHotel;
import com.wedservice.backend.module.hotels.mapper.HotelMapper;
import com.wedservice.backend.module.hotels.repository.HotelRepository;
import com.wedservice.backend.module.hotels.repository.HotelRoomInventoryRepository;
import com.wedservice.backend.module.hotels.repository.HotelRoomTypeRepository;
import com.wedservice.backend.module.hotels.repository.HotelImageRepository;
import com.wedservice.backend.module.hotels.dto.response.HotelDetailResponse;
import com.wedservice.backend.module.hotels.dto.response.HotelImageDto;
import com.wedservice.backend.module.hotels.dto.response.RoomTypeResponse;
import com.wedservice.backend.module.hotels.dto.response.RoomRatePlanResponse;
import com.wedservice.backend.module.hotels.dto.request.HotelRoomTypeRequest;
import com.wedservice.backend.module.hotels.dto.response.HotelRoomTypeDto;
import java.util.Arrays;
import java.util.ArrayList;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;
    private final HotelRoomTypeRepository hotelRoomTypeRepository;
    private final HotelRoomInventoryRepository hotelRoomInventoryRepository;
    private final DestinationRepository destinationRepository;
    private final HotelImageRepository hotelImageRepository;
    private final HotelMapper hotelMapper;

    @Transactional(readOnly = true)
    public PageResponse<HotelResponse> search(HotelSearchRequest request) {
        Predicate predicate = buildPredicate(request);
        Page<Hotel> page = hotelRepository.findAll(
                predicate,
                PageRequest.of(request.getPage(), request.getSize(), Sort.by(Sort.Direction.ASC, "name"))
        );
        List<HotelResponse> content = page.getContent().stream()
                .map(hotel -> enrich(hotelMapper.toResponse(hotel), request))
                .toList();
        return PageResponse.<HotelResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public HotelResponse getById(Long id, LocalDate checkinDate, LocalDate checkoutDate) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
        HotelResponse base = hotelMapper.toResponse(hotel);
        HotelSearchRequest req = new HotelSearchRequest();
        req.setCheckinDate(checkinDate);
        req.setCheckoutDate(checkoutDate);
        return enrich(base, req);
    }

    @Transactional(readOnly = true)
    public HotelDetailResponse getDetailById(Long id, LocalDate checkinDate, LocalDate checkoutDate) {
        HotelResponse base = getById(id, checkinDate, checkoutDate);
        List<String> amenities = hotelRepository.findAmenityNamesByHotelId(id);
        List<HotelImageDto> images = hotelImageRepository.findByHotelIdAndIsActiveTrueOrderBySortOrderAsc(id).stream()
                .map(i -> HotelImageDto.builder()
                        .id(i.getId())
                        .mediaUrl(i.getMediaUrl())
                        .altText(i.getAltText())
                        .isCover(i.getIsCover())
                        .build())
                .toList();

        List<HotelRoomType> roomEntities = hotelRoomTypeRepository.findByHotelIdAndDeletedAtIsNull(id);
        List<RoomTypeResponse> roomTypes = roomEntities.stream().map(rt -> {
            RoomRatePlanResponse nonRef = RoomRatePlanResponse.builder()
                    .planId(rt.getId() + "_NON_REF")
                    .inclusionTags(Arrays.asList("Không hoàn huỷ \u2460", "WiFi miễn phí", "Phòng tập", "Vào hồ bơi miễn phí"))
                    .isBreakfastIncluded(false)
                    .isNonRefundable(true)
                    .defaultPrice(rt.getBasePrice())
                    .originalPrice(rt.getBasePrice().multiply(new BigDecimal("1.15")))
                    .discountPrice(rt.getBasePrice())
                    .promoTag("Siêu tiết kiệm \uD83C\uDF81")
                    .remainingRooms(rt.getInventoryTotal() > 0 ? rt.getInventoryTotal() : 5)
                    .build();

            RoomRatePlanResponse withBreakfast = RoomRatePlanResponse.builder()
                    .planId(rt.getId() + "_BFAST")
                    .inclusionTags(Arrays.asList("Đã bao gồm bữa sáng", "Không hoàn huỷ \u2460", "WiFi miễn phí", "Phòng tập", "Vào hồ bơi miễn phí"))
                    .isBreakfastIncluded(true)
                    .isNonRefundable(true)
                    .defaultPrice(rt.getBasePrice().multiply(new BigDecimal("1.25")))
                    .originalPrice(rt.getBasePrice().multiply(new BigDecimal("1.4")))
                    .discountPrice(rt.getBasePrice().multiply(new BigDecimal("1.25")))
                    .promoTag("Siêu tiết kiệm \uD83C\uDF81")
                    .remainingRooms(rt.getInventoryTotal() > 0 ? rt.getInventoryTotal() : 5)
                    .build();

            return RoomTypeResponse.builder()
                    .id(rt.getId())
                    .code(rt.getCode())
                    .name(rt.getName())
                    .bedType(rt.getBedType())
                    .maxAdults(rt.getMaxAdults())
                    .maxChildren(rt.getMaxChildren())
                    .maxOccupancy(rt.getMaxOccupancy())
                    .roomAreaSize(20 + (int)(rt.getId() % 30))
                    .roomView("Cảnh thành phố")
                    .isRefundable(rt.getIsRefundable())
                    .imageUrl(images.isEmpty() ? null : images.get((int)(rt.getId() % images.size())).getMediaUrl())
                    .ratePlans(Arrays.asList(nonRef, withBreakfast))
                    .build();
        }).toList();

        return HotelDetailResponse.builder()
                .basicInfo(base)
                .amenities(amenities)
                .images(images)
                .roomTypes(roomTypes)
                .build();
    }

    @Transactional
    public HotelResponse create(HotelRequest request) {
        if (hotelRepository.existsByCodeIgnoreCase(request.getCode())) {
            throw BadRequestException.i18n("api.error.hotel.codeExists");
        }
        Destination destination = destinationRepository.findById(request.getDestinationId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + request.getDestinationId()));
        Hotel entity = hotelMapper.toEntity(request);
        entity.setDestination(destination);
        if (!StringUtils.hasText(entity.getStatus())) {
            entity.setStatus("active");
        }
        Hotel savedHotel = hotelRepository.save(entity);

        if (request.getRoomTypes() != null) {
            for (int i = 0; i < request.getRoomTypes().size(); i++) {
                HotelRoomTypeRequest rtReq = request.getRoomTypes().get(i);
                HotelRoomType rt = new HotelRoomType();
                rt.setHotel(savedHotel);
                rt.setCode(savedHotel.getCode() + "-RT" + (i + 1));
                rt.setName(rtReq.getName());
                rt.setBedType("king");
                rt.setMaxAdults(rtReq.getMaxOccupancy() >= 2 ? 2 : 1);
                rt.setMaxChildren(rtReq.getMaxOccupancy() > 2 ? rtReq.getMaxOccupancy() - 2 : 0);
                rt.setMaxOccupancy(rtReq.getMaxOccupancy());
                rt.setBasePrice(rtReq.getPricePerNight());
                rt.setCurrency("VND");
                rt.setInventoryTotal(rtReq.getTotalRooms());
                rt.setIsRefundable(true);
                rt.setStatus(rtReq.getStatus());
                hotelRoomTypeRepository.save(rt);
            }
        }

        return getById(savedHotel.getId(), null, null);
    }

    @Transactional
    public HotelResponse update(Long id, HotelRequest request) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
        Destination destination = destinationRepository.findById(request.getDestinationId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + request.getDestinationId()));
        hotelMapper.update(hotel, request);
        hotel.setDestination(destination);
        if (!StringUtils.hasText(hotel.getStatus())) {
            hotel.setStatus("active");
        }
        Hotel savedHotel = hotelRepository.save(hotel);

        if (request.getRoomTypes() != null) {
            List<HotelRoomType> oldTypes = hotelRoomTypeRepository.findByHotelIdAndDeletedAtIsNull(savedHotel.getId());
            hotelRoomTypeRepository.deleteAll(oldTypes);

            for (int i = 0; i < request.getRoomTypes().size(); i++) {
                HotelRoomTypeRequest rtReq = request.getRoomTypes().get(i);
                HotelRoomType rt = new HotelRoomType();
                rt.setHotel(savedHotel);
                rt.setCode(savedHotel.getCode() + "-RT" + (i + 1));
                rt.setName(rtReq.getName());
                rt.setBedType("king");
                rt.setMaxAdults(rtReq.getMaxOccupancy() >= 2 ? 2 : 1);
                rt.setMaxChildren(rtReq.getMaxOccupancy() > 2 ? rtReq.getMaxOccupancy() - 2 : 0);
                rt.setMaxOccupancy(rtReq.getMaxOccupancy());
                rt.setBasePrice(rtReq.getPricePerNight());
                rt.setCurrency("VND");
                rt.setInventoryTotal(rtReq.getTotalRooms());
                rt.setIsRefundable(true);
                rt.setStatus(rtReq.getStatus());
                hotelRoomTypeRepository.save(rt);
            }
        }

        return getById(savedHotel.getId(), null, null);
    }

    /**
     * Kiem tra con phong theo khoang ngay.
     * Dieu kien dat cho hop le: moi ngay trong khoang [checkin, checkout) phai con inventory du.
     */
    private boolean isAvailable(Long hotelId, LocalDate checkinDate, LocalDate checkoutDate, int rooms) {
        if (checkinDate == null || checkoutDate == null || !checkoutDate.isAfter(checkinDate)) {
            return true;
        }
        List<HotelRoomType> roomTypes = hotelRoomTypeRepository.findByHotelIdAndDeletedAtIsNull(hotelId);
        if (roomTypes.isEmpty()) {
            return false;
        }
        for (HotelRoomType roomType : roomTypes) {
            boolean ok = true;
            for (LocalDate date = checkinDate; date.isBefore(checkoutDate); date = date.plusDays(1)) {
                HotelRoomInventory inventory = hotelRoomInventoryRepository
                        .findByRoomTypeIdAndStayDate(roomType.getId(), date)
                        .orElse(null);
                if (inventory == null || inventory.getAvailableQty() < rooms) {
                    ok = false;
                    break;
                }
            }
            if (ok) {
                return true;
            }
        }
        return false;
    }

    private BigDecimal minRoomPrice(Long hotelId) {
        return hotelRoomTypeRepository.findByHotelIdAndDeletedAtIsNull(hotelId).stream()
                .map(HotelRoomType::getBasePrice)
                .filter(v -> v != null)
                .min(Comparator.naturalOrder())
                .orElse(BigDecimal.ZERO);
    }

    private HotelResponse enrich(HotelResponse base, HotelSearchRequest request) {
        BigDecimal minPrice = minRoomPrice(base.getId());
        boolean available = isAvailable(
                base.getId(),
                request.getCheckinDate(),
                request.getCheckoutDate(),
                request.getRooms() == null ? 1 : request.getRooms()
        );
        
        List<HotelRoomTypeDto> roomTypeDtos = hotelRoomTypeRepository.findByHotelIdAndDeletedAtIsNull(base.getId())
                .stream()
                .map(rt -> HotelRoomTypeDto.builder()
                        .name(rt.getName())
                        .pricePerNight(rt.getBasePrice())
                        .maxOccupancy(rt.getMaxOccupancy())
                        .totalRooms(rt.getInventoryTotal())
                        .status(rt.getStatus())
                        .build())
                .toList();

        return HotelResponse.builder()
                .id(base.getId())
                .destinationId(base.getDestinationId())
                .destinationName(base.getDestinationName())
                .code(base.getCode())
                .name(base.getName())
                .slug(base.getSlug())
                .description(base.getDescription())
                .starRating(base.getStarRating())
                .reviewScore(base.getReviewScore())
                .phone(base.getPhone())
                .email(base.getEmail())
                .province(base.getProvince())
                .district(base.getDistrict())
                .address(base.getAddress())
                .status(base.getStatus())
                .minRoomPrice(minPrice)
                .available(available)
                .roomTypes(roomTypeDtos)
                .createdAt(base.getCreatedAt())
                .updatedAt(base.getUpdatedAt())
                .build();
    }

    private Predicate buildPredicate(HotelSearchRequest request) {
        QHotel hotel = QHotel.hotel;
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(hotel.deletedAt.isNull());
        if (request.getDestinationId() != null) {
            builder.and(hotel.destination.id.eq(request.getDestinationId()));
        }
        if (StringUtils.hasText(request.getKeyword())) {
            builder.and(
                    hotel.name.containsIgnoreCase(request.getKeyword())
                            .or(hotel.code.containsIgnoreCase(request.getKeyword()))
                            .or(hotel.province.containsIgnoreCase(request.getKeyword()))
            );
        }
        if (request.getMinStar() != null) {
            builder.and(hotel.starRating.goe(request.getMinStar()));
        }
        if (request.getMaxStar() != null) {
            builder.and(hotel.starRating.loe(request.getMaxStar()));
        }
        if (StringUtils.hasText(request.getMinPrice() == null ? null : request.getMinPrice().toPlainString())
                || StringUtils.hasText(request.getMaxPrice() == null ? null : request.getMaxPrice().toPlainString())) {
            // Price filtering requires room data; apply in service layer if needed in next iteration.
        }
        return builder;
    }
}


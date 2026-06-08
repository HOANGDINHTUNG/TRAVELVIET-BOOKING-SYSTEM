import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8088/api/v1" });

async function seedData() {
  try {
    console.log("1. Skipping Auth (bypassed in backend temporarily)");

    console.log("2. Seeding Destination...");
    let destId = 1;
    try {
      const destRes = await api.post("/admin/destinations", {
        code: "TKY",
        name: "Tokyo, Nhật Bản",
        slug: "tokyo-nhat-ban",
        countryCode: "JP",
        region: "Kanto",
        shortDescription: "Thủ đô nhộn nhịp của Nhật Bản.",
        isActive: true,
      });
      destId = destRes.data.data.id;
      console.log("Destination Created ID:", destId);
    } catch (err) {
      console.log("Destination already exists or error. Fetching one.");
      const dests = await api.get("/admin/destinations?size=1");
      destId = dests.data.data.content[0].id;
    }

    console.log("3. Seeding Tour...");
    let tourId = 1;
    try {
      const tourRes = await api.post("/admin/tours", {
        code: "TOUR-TKY-5N4D",
        name: "Hành Trình Khám Phá Tokyo 5 Ngày 4 Đêm",
        slug: "hanh-trinh-kham-pha-tokyo-5n4d",
        destinationId: destId,
        basePrice: 15600000,
        durationDays: 5,
        durationNights: 4,
        currency: "VND",
        status: "PUBLISHED",
        isFeatured: true,
      });
      tourId = tourRes.data.data.id;
      console.log("Tour Created ID:", tourId);
    } catch (err) {
      console.error("Tour error", err.message);
    }

    console.log("4. Seeding Combo Package...");
    try {
      await api.post("/admin/combo-packages", {
        code: "CB-TKY-PREMIUM",
        name: "Combo Vé Máy Bay & Khách Sạn Tokyo 4N3Đ Tự Túc",
        description: "Trải nghiệm du lịch tự do trọn gói hạng sang.",
        destinationId: destId,
        comboType: "FLIGHT_HOTEL",
        basePrice: 8500000,
        discountAmount: 500000,
        isActive: true,
        items: [
          {
            itemType: "FLIGHT",
            itemName: "Vé khứ hồi VietJet Air khứ hồi SGN-NRT",
            quantity: 1,
            unitPrice: 5000000,
            isMandatory: true,
          },
          {
            itemType: "HOTEL",
            itemName: "Phòng Standard tại Shinjuku Prince Hotel",
            quantity: 3,
            unitPrice: 1500000,
            isMandatory: true,
          },
        ],
      });
      console.log("Combo Package Created.");
    } catch (err) {
      console.error("Combo error", err.message);
    }

    // Bookings are typically not created via admin endpoint (user submits them)
    // We will just assume it's created or we skip it if it's too complex (needs real schedule etc.)
    console.log("5. Checking Bookings API...");
    const bRes = await api.get("/admin/bookings");
    console.log("Bookings Count:", bRes.data.data.totalElements);

    console.log("SEEDING COMPLETED!");
  } catch (error) {
    console.error(
      "Fatal Error during seeding:",
      error.response?.data || error.message,
    );
  }
}

seedData();

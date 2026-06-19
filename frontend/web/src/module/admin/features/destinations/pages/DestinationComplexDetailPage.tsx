import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import {
  ArrowLeft,
  Save,
  Loader2,
  Image as ImageIcon,
  Calendar,
  Utensils,
  Lightbulb,
  Activity,
} from "lucide-react";
import type { DestinationRequest } from "../api/destinations.api";
import {
  useGetDestinationByUuid,
  useUpdateDestination,
} from "../api/destinations.api";
import { toast } from "sonner";
import * as Tabs from "@radix-ui/react-tabs";

// We'll create multiple sub-components for field arrays to keep the file clean.
// But for now, we put everything in one file for quick assembly.

export default function DestinationComplexDetailPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();

  const { data: destination, isLoading: isFetching } = useGetDestinationByUuid(
    uuid || "",
  );
  const updateMutation = useUpdateDestination();

  const { register, control, handleSubmit, reset } =
    useForm<DestinationRequest>({
      defaultValues: {
        mediaList: [],
        foods: [],
        specialties: [],
        activities: [],
        tips: [],
        events: [],
      },
    });

  // Setup multiple FieldArrays
  const mediaArr = useFieldArray({ control, name: "mediaList" });
  const foodsArr = useFieldArray({ control, name: "foods" });
  const tipsArr = useFieldArray({ control, name: "tips" });
  const eventsArr = useFieldArray({ control, name: "events" });
  const activitiesArr = useFieldArray({ control, name: "activities" });
  // const specialtiesArr = useFieldArray({ control, name: "specialties" });

  const mediaListValues = useWatch({ control, name: "mediaList" });

  useEffect(() => {
    if (destination) {
      // The backend returns details with translations, but we just need to populate the simple arrays.
      reset({
        name: destination.name,
        code: destination.code,
        slug: destination.slug,
        mediaList: destination.mediaList || [],
        foods: destination.foods || [],
        tips: destination.tips || [],
        events: destination.events || [],
        activities: destination.activities || [],
        specialties: destination.specialties || [],
      });
    }
  }, [destination, reset]);

  const onSubmit = (data: DestinationRequest) => {
    if (!uuid) return;

    // We only merge the array fields with existing destination data.
    // The problem is that DestinationRequest requires name and code.
    // They are available in the reset() form state.
    const payload: DestinationRequest = {
      ...destination,
      name: data.name,
      code: data.code,
      countryCode: destination?.countryCode || "VN",
      province: destination?.province || "",
      isFeatured: destination?.isFeatured || false,
      isActive:
        destination?.isActive !== undefined ? destination.isActive : true,
      isOfficial: destination?.isOfficial || false,
      mediaList: data.mediaList,
      foods: data.foods,
      tips: data.tips,
      events: data.events,
      activities: data.activities,
      specialties: data.specialties,
    };

    updateMutation.mutate(
      { uuid, data: payload },
      {
        onSuccess: () => {
          toast.success("Cập nhật thông tin chi tiết thành công");
        },
        onError: (err: unknown) => {
          const errorMsg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Đã có lỗi xảy ra";
          toast.error(errorMsg);
        },
      },
    );
  };

  if (isFetching) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="p-8 text-slate-500">
        Không tìm thấy thông tin điểm đến.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900 border-t border-l border-slate-200 dark:border-slate-800 rounded-tl-3xl shadow-inner relative overflow-hidden transition-colors w-[95%] 2xl:w-[1500px] xl:w-[1280px] mx-auto pb-10">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold dark:text-white">
              Cấu hình Nâng Cao
            </h1>
            <p className="text-sm text-slate-500">
              {destination.name} ({destination.code})
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-full font-bold hover:bg-indigo-700 transition"
        >
          {updateMutation.isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Lưu Toàn Bộ
        </button>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        <Tabs.Root
          defaultValue="media"
          className="flex flex-col lg:flex-row gap-6"
        >
          <Tabs.List className="flex lg:flex-col lg:w-48 xl:w-56 overflow-x-auto lg:overflow-visible border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 pr-0 lg:pr-4 gap-2 flex-shrink-0">
            <Tabs.Trigger
              value="media"
              className="flex items-center gap-2 p-2 px-3 lg:px-4 text-left w-full rounded-md text-slate-500 font-medium data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900/30 dark:data-[state=active]:text-indigo-400"
            >
              <ImageIcon size={18} /> Ảnh / Video
            </Tabs.Trigger>
            <Tabs.Trigger
              value="foods"
              className="flex items-center gap-2 p-2 px-3 lg:px-4 text-left w-full rounded-md text-slate-500 font-medium data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 dark:data-[state=active]:bg-orange-900/30 dark:data-[state=active]:text-orange-400"
            >
              <Utensils size={18} /> Ẩm thực nổi bật
            </Tabs.Trigger>
            <Tabs.Trigger
              value="tips"
              className="flex items-center gap-2 p-2 px-3 lg:px-4 text-left w-full rounded-md text-slate-500 font-medium data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/30 dark:data-[state=active]:text-emerald-400"
            >
              <Lightbulb size={18} /> Mẹo Du lịch
            </Tabs.Trigger>
            <Tabs.Trigger
              value="events"
              className="flex items-center gap-2 p-2 px-3 lg:px-4 text-left w-full rounded-md text-slate-500 font-medium data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700 dark:data-[state=active]:bg-rose-900/30 dark:data-[state=active]:text-rose-400"
            >
              <Calendar size={18} /> Lễ hội / Sự kiện
            </Tabs.Trigger>
            <Tabs.Trigger
              value="activities"
              className="flex items-center gap-2 p-2 px-3 lg:px-4 text-left w-full rounded-md text-slate-500 font-medium data-[state=active]:bg-sky-50 data-[state=active]:text-sky-700 dark:data-[state=active]:bg-sky-900/30 dark:data-[state=active]:text-sky-400"
            >
              <Activity size={18} /> Hoạt động vui chơi
            </Tabs.Trigger>
          </Tabs.List>

          <div className="flex-1 lg:pl-2">
            <Tabs.Content value="media" className="outline-none">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <ImageIcon size={20} className="text-indigo-500" /> Thư viện
                    Media
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      mediaArr.append({
                        mediaUrl: "",
                        mediaType: "IMAGE",
                        altText: "",
                        sortOrder: 0,
                        isActive: true,
                      })
                    }
                    className="text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-medium px-3 py-1.5 rounded-md text-slate-700 dark:text-slate-300"
                  >
                    + Thêm mới
                  </button>
                </div>

                {mediaArr.fields.length === 0 && (
                  <div className="text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400">
                    Chưa có ảnh/video nào. Bấm nút Thêm mới ở trên.
                  </div>
                )}

                <div className="space-y-4">
                  {mediaArr.fields.map((field, index) => {
                    const previewUrl = mediaListValues?.[index]?.mediaUrl;
                    const _mediaType = mediaListValues?.[index]?.mediaType;
                    const isImage =
                      _mediaType === "IMAGE" || _mediaType === "COVER";

                    return (
                      <div
                        key={field.id}
                        className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg relative"
                      >
                        <button
                          type="button"
                          onClick={() => mediaArr.remove(index)}
                          className="absolute top-2 right-2 text-slate-400 hover:text-red-500 text-xs font-bold"
                        >
                          Xóa
                        </button>
                        <div className="flex flex-row gap-4 pt-2">
                          <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400">
                            {isImage && previewUrl ? (
                              <img
                                src={previewUrl}
                                alt="preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://placehold.co/150x150?text=Error";
                                }}
                              />
                            ) : (
                              <ImageIcon size={24} />
                            )}
                          </div>
                          <div className="flex-1 grid grid-cols-6 gap-3">
                            <div className="col-span-1">
                              <label className="block text-xs font-semibold text-slate-500 mb-1">
                                Loại
                              </label>
                              <select
                                {...register(
                                  `mediaList.${index}.mediaType` as const,
                                )}
                                className="w-full text-sm rounded bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 px-2 py-1.5"
                              >
                                <option value="IMAGE">Image</option>
                                <option value="VIDEO">Video</option>
                                <option value="COVER">Cover</option>
                              </select>
                            </div>
                            <div className="col-span-3">
                              <label className="block text-xs font-semibold text-slate-500 mb-1">
                                URL (Ảnh/Video)
                              </label>
                              <input
                                {...register(
                                  `mediaList.${index}.mediaUrl` as const,
                                )}
                                placeholder="https://..."
                                className="w-full text-sm rounded bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 px-2 py-1.5"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs font-semibold text-slate-500 mb-1">
                                Thứ tự
                              </label>
                              <input
                                type="number"
                                {...register(
                                  `mediaList.${index}.sortOrder` as const,
                                )}
                                className="w-full text-sm rounded bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 px-2 py-1.5"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="foods" className="outline-none">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Utensils size={20} className="text-orange-500" /> Đặc Sản /
                    Món Ăn
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      foodsArr.append({
                        foodName: "",
                        description: "",
                        isFeatured: true,
                      })
                    }
                    className="text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 dark:bg-slate-800 font-medium px-3 py-1.5 rounded-md"
                  >
                    + Thêm món ăn
                  </button>
                </div>

                <div className="space-y-4">
                  {foodsArr.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg relative"
                    >
                      <button
                        type="button"
                        onClick={() => foodsArr.remove(index)}
                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500 text-xs font-bold"
                      >
                        Xóa
                      </button>
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Tên món ăn
                          </label>
                          <input
                            {...register(`foods.${index}.foodName` as const)}
                            className="w-full text-sm rounded bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 px-2 py-1.5"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Mô tả độ ngon
                          </label>
                          <textarea
                            {...register(`foods.${index}.description` as const)}
                            rows={2}
                            className="w-full text-sm rounded bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 px-2 py-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="tips" className="outline-none">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Lightbulb size={20} className="text-emerald-500" /> Mẹo Du
                    lịch
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      tipsArr.append({
                        tipTitle: "",
                        tipContent: "",
                        sortOrder: 0,
                      })
                    }
                    className="text-sm bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-slate-800 font-medium px-3 py-1.5 rounded-md"
                  >
                    + Thêm Mẹo
                  </button>
                </div>

                <div className="space-y-4">
                  {tipsArr.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg relative"
                    >
                      <button
                        type="button"
                        onClick={() => tipsArr.remove(index)}
                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500 text-xs font-bold"
                      >
                        Xóa
                      </button>
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Tiêu đề Mẹo
                          </label>
                          <input
                            {...register(`tips.${index}.tipTitle` as const)}
                            className="w-full text-sm rounded bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 px-2 py-1.5"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Nội dung chi tiết
                          </label>
                          <textarea
                            {...register(`tips.${index}.tipContent` as const)}
                            rows={3}
                            className="w-full text-sm rounded bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 px-2 py-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="events" className="outline-none">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Calendar size={20} className="text-rose-500" /> Sự kiện /
                    Lễ hội
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      eventsArr.append({
                        eventName: "",
                        eventType: "",
                        description: "",
                      })
                    }
                    className="text-sm bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-slate-800 font-medium px-3 py-1.5 rounded-md"
                  >
                    + Bổ sung Lễ Hội
                  </button>
                </div>

                <div className="space-y-4">
                  {eventsArr.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg relative"
                    >
                      <button
                        type="button"
                        onClick={() => eventsArr.remove(index)}
                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500 text-xs font-bold"
                      >
                        Xóa
                      </button>
                      <div className="space-y-3 pt-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">
                              Tên Sự kiện
                            </label>
                            <input
                              {...register(
                                `events.${index}.eventName` as const,
                              )}
                              className="w-full text-sm rounded bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 px-2 py-1.5"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">
                              Phân loại (Lễ hội/Âm nhạc/Thể thao...)
                            </label>
                            <input
                              {...register(
                                `events.${index}.eventType` as const,
                              )}
                              className="w-full text-sm rounded bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 px-2 py-1.5"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Mô tả Lễ hội
                          </label>
                          <textarea
                            {...register(
                              `events.${index}.description` as const,
                            )}
                            rows={2}
                            className="w-full text-sm rounded bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 px-2 py-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="activities" className="outline-none">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Activity size={20} className="text-sky-500" /> Hoạt động
                    vui chơi
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      activitiesArr.append({
                        activityName: "",
                        description: "",
                        activityScore: 10,
                      })
                    }
                    className="text-sm bg-sky-100 hover:bg-sky-200 text-sky-700 dark:bg-slate-800 font-medium px-3 py-1.5 rounded-md"
                  >
                    + Nhập hoạt động
                  </button>
                </div>

                <div className="space-y-4">
                  {activitiesArr.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg relative"
                    >
                      <button
                        type="button"
                        onClick={() => activitiesArr.remove(index)}
                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500 text-xs font-bold"
                      >
                        Xóa
                      </button>
                      <div className="space-y-3 pt-2">
                        <div className="grid grid-cols-4 gap-3">
                          <div className="col-span-3">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">
                              Hoạt động (Ví dụ: Chèo thuyền Kayak)
                            </label>
                            <input
                              {...register(
                                `activities.${index}.activityName` as const,
                              )}
                              className="w-full text-sm rounded bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 px-2 py-1.5"
                            />
                          </div>
                          <div className="col-span-1">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">
                              Điểm đánh giá (Score)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              {...register(
                                `activities.${index}.activityScore` as const,
                              )}
                              className="w-full text-sm rounded bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 px-2 py-1.5"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Mô tả chi tiết
                          </label>
                          <textarea
                            {...register(
                              `activities.${index}.description` as const,
                            )}
                            rows={2}
                            className="w-full text-sm rounded bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 px-2 py-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
}

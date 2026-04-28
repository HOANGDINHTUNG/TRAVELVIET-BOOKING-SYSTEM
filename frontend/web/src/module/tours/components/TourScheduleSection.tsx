import { Calendar, Users } from "lucide-react";
import type { BackendTourSchedule } from "../../home/database/interface/publicTravel";

type TourScheduleSectionProps = {
  schedules: BackendTourSchedule[];
};

export function TourScheduleSection({ schedules }: TourScheduleSectionProps) {
  if (schedules.length === 0) {
    return (
      <section className="tour-schedule-section">
        <h2 className="section-title">Lịch khởi hành</h2>
        <div className="no-schedules">
          <p>
            Hiện chưa có lịch khởi hành mới. Vui lòng liên hệ để được hỗ trợ.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="tour-schedule-section">
      <h2 className="section-title">Lịch khởi hành & Giá</h2>

      <div className="schedules-grid">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="schedule-card">
            <div className="schedule-date">
              <Calendar size={20} />
              <div className="date-info">
                <span className="label">Ngày đi</span>
                <span className="value">
                  {new Date(schedule.departureAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>

            <div className="schedule-availability">
              <Users size={20} />
              <div className="seats-info">
                <span className="label">Chỗ trống</span>
                <span className="value">{schedule.remainingSeats} khách</span>
              </div>
            </div>

            <div className="schedule-price">
              <span className="price-value">
                {schedule.adultPrice.toLocaleString()} VND
              </span>
              <span className="price-label">mỗi khách</span>
            </div>

            <button className="book-btn">Đặt ngay</button>
          </div>
        ))}
      </div>
    </section>
  );
}

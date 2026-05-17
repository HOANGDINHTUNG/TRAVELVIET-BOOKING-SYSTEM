-- Flyway V2: indexes (baseline + extension)

-- 15. INDEXES -- 


CREATE INDEX idx_users_status ON users(status); 
CREATE INDEX idx_users_user_category ON users(user_category); 
CREATE INDEX idx_roles_code_active ON roles(code, is_active); 
CREATE INDEX idx_permissions_module_action ON permissions(module_name, action_name); 
CREATE INDEX idx_users_member_level ON users(member_level); 
CREATE INDEX idx_destinations_province ON destinations(province); 
CREATE INDEX idx_destinations_region ON destinations(region); 
CREATE INDEX idx_tours_destination_id ON tours(destination_id); 
CREATE INDEX idx_tours_status_featured ON tours(status, is_featured); 
CREATE INDEX idx_tour_tags_tag_id ON tour_tags(tag_id); 
CREATE INDEX idx_tour_schedules_tour_id ON tour_schedules(tour_id); 
CREATE INDEX idx_tour_schedules_departure_at ON tour_schedules(departure_at); 
CREATE INDEX idx_tour_schedules_status ON tour_schedules(status); 
CREATE INDEX idx_bookings_user_id ON bookings(user_id); 
CREATE INDEX idx_bookings_tour_id ON bookings(tour_id); 
CREATE INDEX idx_bookings_schedule_id ON bookings(schedule_id); 
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_order_id ON bookings(order_id);
CREATE INDEX idx_payments_order_id ON payments(order_id); 
CREATE INDEX idx_payments_booking_id ON payments(booking_id); 
CREATE INDEX idx_refund_requests_booking_id ON refund_requests(booking_id); 
CREATE INDEX idx_reviews_tour_id ON reviews(tour_id); 
CREATE INDEX idx_reviews_user_id ON reviews(user_id); 
CREATE INDEX idx_weather_forecasts_destination_date ON weather_forecasts(destination_id, forecast_date); 
CREATE INDEX idx_weather_alerts_destination_id ON weather_alerts(destination_id); 
CREATE INDEX idx_crowd_predictions_destination_date ON crowd_predictions(destination_id, prediction_date); 
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read_at); 
CREATE INDEX idx_support_sessions_user_id ON support_sessions(user_id); 
CREATE INDEX idx_support_messages_session_id ON support_messages(session_id); 
CREATE INDEX idx_travel_passports_user_id ON travel_passports(user_id); 
CREATE INDEX idx_user_checkins_user_id ON user_checkins(user_id); 
CREATE INDEX idx_user_tour_views_user_id ON user_tour_views(user_id); 
CREATE INDEX idx_wishlist_tours_user_id ON wishlist_tours(user_id);

CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_payment_attempts_payment_status ON payment_attempts(payment_id, status);
CREATE INDEX idx_payment_webhook_logs_event_ref ON payment_webhook_logs(event_ref);
CREATE INDEX idx_refund_status_history_request ON refund_status_history(refund_request_id);
CREATE INDEX idx_refund_transactions_request ON refund_transactions(refund_request_id);
CREATE INDEX idx_booking_addons_booking ON booking_addons(booking_id);
CREATE INDEX idx_tour_price_rules_tour_active ON tour_price_rules(tour_id, is_active);
CREATE INDEX idx_schedule_price_rules_schedule_active ON schedule_price_rules(schedule_id, is_active);
CREATE INDEX idx_suppliers_type_status ON suppliers(supplier_type, status);
CREATE INDEX idx_supplier_services_supplier ON supplier_services(supplier_id);
CREATE INDEX idx_schedule_resource_allocations_schedule ON schedule_resource_allocations(schedule_id);
CREATE INDEX idx_destination_proposals_user_status ON destination_proposals(proposed_by, status);
CREATE INDEX idx_saved_searches_user ON saved_searches(user_id);
CREATE INDEX idx_voucher_redemptions_voucher_user ON voucher_redemptions(voucher_id, user_id);
CREATE INDEX idx_invoices_user_status ON invoices(user_id, status);
CREATE INDEX idx_commissions_source ON commissions(source_type, source_ref_id);
CREATE INDEX idx_tour_schedule_status_history_schedule ON tour_schedule_status_history(schedule_id);
CREATE INDEX idx_notification_deliveries_user_status ON notification_deliveries(user_id, status);
CREATE INDEX idx_file_attachments_entity ON file_attachments(entity_name, entity_id);
CREATE INDEX idx_tour_departure_hubs_tour ON tour_departure_hubs (tour_id, is_primary);
CREATE INDEX idx_tour_combo_packages_tour ON tour_combo_packages (tour_id, package_role);
CREATE INDEX idx_tour_schedules_open_lookup ON tour_schedules (tour_id, status, departure_at);

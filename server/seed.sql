-- Demo rows (safe to re-run only on empty DB; init-db skips if reports exist)

INSERT INTO community_reports (city, category, alert_type, tier, title, description, lat, lon, live_gps, landmark, geo_tag, reported_at)
VALUES
  ('Bengaluru', 'waterlogging', 'hazard', 'severe', 'Hazard report: Flooding / waterlogging',
   'Underpass waterlogged near Silk Board — avoid if possible.', 12.9172, 77.6226, 0,
   'Silk Board junction', '12.917200°N, 77.622600°E', datetime('now', '-2 hours')),
  ('Mumbai', 'treefall', 'hazard', 'relatively', 'Hazard report: Tree fall / blocked road',
   'Fallen tree blocking side lane — use alternate route.', 18.9750, 72.8258, 0,
   'Dadar West', '18.975000°N, 72.825800°E', datetime('now', '-5 hours'));

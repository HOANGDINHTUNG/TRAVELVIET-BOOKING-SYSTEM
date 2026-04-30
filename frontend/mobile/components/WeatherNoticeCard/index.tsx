import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchDestinationWeatherNotice } from '@/services/weatherApi';
import type {
  WeatherAlert,
  WeatherForecast,
  WeatherNoticeCenter,
  WeatherNoticeResult,
  WeatherPublicNotice,
  WeatherSeverity,
} from '@/types/Weather';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type WeatherNoticeCardProps = {
  destinationUuid: string;
  destinationId?: number;
  destinationName?: string;
  variant?: 'home' | 'detail';
};

type MetricItem = {
  key: string;
  label: string;
  value: string;
  icon: IoniconName;
};

const severityConfig: Record<
  WeatherSeverity,
  { icon: IoniconName; tone: string; soft: string; label: string }
> = {
  info: {
    icon: 'partly-sunny-outline',
    tone: '#087f9c',
    soft: 'rgba(8, 127, 156, 0.11)',
    label: 'On dinh',
  },
  watch: {
    icon: 'cloudy-outline',
    tone: '#bc6c25',
    soft: 'rgba(188, 108, 37, 0.12)',
    label: 'Can theo doi',
  },
  warning: {
    icon: 'rainy-outline',
    tone: '#b42318',
    soft: 'rgba(180, 35, 24, 0.12)',
    label: 'Can luu y',
  },
  danger: {
    icon: 'warning-outline',
    tone: '#8f1d14',
    soft: 'rgba(143, 29, 20, 0.14)',
    label: 'Rui ro cao',
  },
};

export function WeatherNoticeCard({
  destinationUuid,
  destinationId,
  destinationName = 'diem den',
  variant = 'home',
}: WeatherNoticeCardProps) {
  const [result, setResult] = useState<WeatherNoticeResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchDestinationWeatherNotice(destinationUuid, destinationId)
      .then((payload) => {
        if (isMounted) {
          setResult(payload);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [destinationId, destinationUuid]);

  const viewModel = useMemo(
    () => buildViewModel(result?.data, destinationName),
    [destinationName, result?.data],
  );
  const tone = severityConfig[viewModel.severity];
  const isDetail = variant === 'detail';

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setIsDetailVisible(true)}
        style={[
          styles.card,
          isDetail && styles.cardDetail,
          { borderColor: tone.soft },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconWrap, { backgroundColor: tone.soft }]}>
            {isLoading ? (
              <ActivityIndicator size="small" color={tone.tone} />
            ) : (
              <Ionicons name={tone.icon} size={22} color={tone.tone} />
            )}
          </View>

          <View style={styles.headerCopy}>
            <View style={styles.kickerRow}>
              <Text style={[styles.kicker, { color: tone.tone }]}>
                {tone.label}
              </Text>
              <Text style={styles.sourcePill}>
                {result?.source === 'backend' ? 'Backend' : 'Du phong'}
              </Text>
            </View>
            <Text style={styles.title} numberOfLines={2}>
              {isLoading ? 'Dang lay thoi tiet...' : viewModel.title}
            </Text>
          </View>
        </View>

        <Text style={styles.summary} numberOfLines={isDetail ? 3 : 2}>
          {isLoading ? 'TravelViet dang cap nhat tinh hinh diem den.' : viewModel.summary}
        </Text>

        <View style={styles.metricRow}>
          {viewModel.metrics.map((metric) => (
            <View style={styles.metricPill} key={metric.key}>
              <Ionicons name={metric.icon} size={14} color="#606c38" />
              <Text style={styles.metricText} numberOfLines={1}>
                {metric.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.destinationText} numberOfLines={1}>
            {destinationName}
          </Text>
          <View style={styles.detailButton}>
            <Text style={styles.detailButtonText}>Chi tiet</Text>
            <Ionicons name="chevron-forward" size={15} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={isDetailVisible}
        onRequestClose={() => setIsDetailVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setIsDetailVisible(false)}
          />
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalKicker}>Weather center</Text>
                <Text style={styles.modalTitle}>{destinationName}</Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsDetailVisible(false)}
              >
                <Ionicons name="close" size={20} color="#283618" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[styles.noticeBlock, { backgroundColor: tone.soft }]}>
                <View style={styles.noticeTitleRow}>
                  <Ionicons name={tone.icon} size={20} color={tone.tone} />
                  <Text style={[styles.noticeTitle, { color: tone.tone }]}>
                    {viewModel.title}
                  </Text>
                </View>
                <Text style={styles.noticeBody}>{viewModel.detail}</Text>
                {viewModel.advice ? (
                  <Text style={styles.adviceText}>{viewModel.advice}</Text>
                ) : null}
              </View>

              <View style={styles.modalMetricGrid}>
                {viewModel.metrics.map((metric) => (
                  <View style={styles.modalMetricItem} key={metric.key}>
                    <Ionicons name={metric.icon} size={17} color="#087f9c" />
                    <Text style={styles.modalMetricLabel}>{metric.label}</Text>
                    <Text style={styles.modalMetricValue}>{metric.value}</Text>
                  </View>
                ))}
              </View>

              {viewModel.alerts.length > 0 ? (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Canh bao dang hieu luc</Text>
                  {viewModel.alerts.map((alert) => (
                    <View style={styles.alertItem} key={`${alert.id}-${alert.title}`}>
                      <Text style={styles.alertTitle}>{alert.title}</Text>
                      {alert.message ? (
                        <Text style={styles.alertMessage}>{alert.message}</Text>
                      ) : null}
                    </View>
                  ))}
                </View>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

function buildViewModel(data: WeatherNoticeCenter | undefined, destinationName: string) {
  const forecast = data?.currentForecast ?? null;
  const notices = data?.notices ?? [];
  const alerts = data?.activeAlerts ?? [];
  const primaryNotice = notices[0];
  const primaryAlert = alerts[0];
  const severity = getSeverity(primaryNotice, primaryAlert, forecast);
  const metrics = buildMetrics(forecast, data);
  const title =
    primaryNotice?.title ||
    primaryAlert?.title ||
    (forecast?.summary ? `Thoi tiet ${destinationName}` : 'Dang cap nhat thoi tiet');
  const summary =
    primaryNotice?.summary ||
    primaryAlert?.message ||
    forecast?.summary ||
    'Du lieu thoi tiet se hien thi khi backend san sang.';
  const detail =
    primaryNotice?.detail ||
    primaryAlert?.message ||
    forecast?.summary ||
    'TravelViet dang lay du lieu moi nhat tu backend.';
  const advice = primaryNotice?.actionAdvice || primaryAlert?.actionAdvice || null;

  return {
    severity,
    title,
    summary,
    detail,
    advice,
    metrics,
    alerts,
  };
}

function getSeverity(
  notice?: WeatherPublicNotice,
  alert?: WeatherAlert,
  forecast?: WeatherForecast | null,
): WeatherSeverity {
  if (notice?.severity) {
    return notice.severity;
  }
  if (alert?.severity) {
    return alert.severity;
  }
  const rain = forecast?.rainProbability ?? 0;
  if (rain >= 75) {
    return 'warning';
  }
  if (rain >= 45) {
    return 'watch';
  }
  return 'info';
}

function buildMetrics(
  forecast: WeatherForecast | null,
  data: WeatherNoticeCenter | undefined,
): MetricItem[] {
  const policy = data?.displayPolicy;
  const metrics: MetricItem[] = [];

  if (forecast && policy?.showTemperature !== false) {
    const temp = formatTemperature(forecast);
    if (temp) {
      metrics.push({ key: 'temp', label: 'Nhiet do', value: temp, icon: 'thermometer-outline' });
    }
  }
  if (forecast?.rainProbability != null && policy?.showRainProbability !== false) {
    metrics.push({
      key: 'rain',
      label: 'Mua',
      value: `${Math.round(forecast.rainProbability)}% mua`,
      icon: 'rainy-outline',
    });
  }
  if (forecast?.windSpeed != null && policy?.showWindSpeed !== false) {
    metrics.push({
      key: 'wind',
      label: 'Gio',
      value: `${Math.round(forecast.windSpeed)} km/h`,
      icon: 'leaf-outline',
    });
  }
  if (forecast?.humidityPercent != null && policy?.showHumidity === true) {
    metrics.push({
      key: 'humidity',
      label: 'Do am',
      value: `${Math.round(forecast.humidityPercent)}% am`,
      icon: 'water-outline',
    });
  }

  return metrics.slice(0, 4);
}

function formatTemperature(forecast: WeatherForecast) {
  const min = forecast.tempMin;
  const max = forecast.tempMax;

  if (min != null && max != null) {
    return `${Math.round(min)}-${Math.round(max)}C`;
  }
  if (max != null) {
    return `${Math.round(max)}C`;
  }
  if (min != null) {
    return `${Math.round(min)}C`;
  }
  return null;
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#fffdf8',
  },
  cardDetail: {
    backgroundColor: '#ffffff',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  kickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  sourcePill: {
    overflow: 'hidden',
    minHeight: 22,
    paddingHorizontal: 8,
    paddingTop: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(96,108,56,0.1)',
    color: '#606c38',
    fontSize: 10,
    fontWeight: '900',
  },
  title: {
    color: '#283618',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
  },
  summary: {
    color: '#606c38',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '700',
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricPill: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(96,108,56,0.16)',
  },
  metricText: {
    color: '#283618',
    fontSize: 11,
    fontWeight: '900',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  destinationText: {
    flex: 1,
    color: '#606c38',
    fontSize: 12,
    fontWeight: '900',
  },
  detailButton: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#606c38',
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(8,11,11,0.42)',
  },
  modalCard: {
    maxHeight: '82%',
    gap: 14,
    padding: 18,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: '#f6f3ea',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  modalKicker: {
    color: '#dda15e',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  modalTitle: {
    marginTop: 3,
    color: '#283618',
    fontSize: 24,
    fontWeight: '900',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#fff',
  },
  noticeBlock: {
    gap: 10,
    padding: 14,
    borderRadius: 8,
  },
  noticeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noticeTitle: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
  },
  noticeBody: {
    color: '#283618',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
  },
  adviceText: {
    color: '#606c38',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '800',
  },
  modalMetricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  modalMetricItem: {
    width: '48%',
    minHeight: 88,
    gap: 5,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fffdf8',
    borderWidth: 1,
    borderColor: 'rgba(96,108,56,0.16)',
  },
  modalMetricLabel: {
    color: '#606c38',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  modalMetricValue: {
    color: '#283618',
    fontSize: 16,
    fontWeight: '900',
  },
  modalSection: {
    gap: 10,
    marginTop: 16,
  },
  modalSectionTitle: {
    color: '#283618',
    fontSize: 16,
    fontWeight: '900',
  },
  alertItem: {
    gap: 5,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(188,108,37,0.2)',
  },
  alertTitle: {
    color: '#283618',
    fontSize: 14,
    fontWeight: '900',
  },
  alertMessage: {
    color: '#606c38',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
});

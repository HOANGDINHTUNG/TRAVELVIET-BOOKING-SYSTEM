import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Footer } from '../../../components/Footer/Footer'
import { EmptyState } from '../../../components/common/ui/EmptyState'
import { ErrorBlock } from '../../../components/common/ui/ErrorBlock'
import { PageLoader } from '../../../components/common/ux/PageLoader'
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks'
import { LoginWelcomeAnimation } from '../../auth/components/LoginWelcome/LoginWelcomeAnimation'
import { AboutSection } from '../components/About/AboutSection'
import { BookingPanel } from '../components/BookingPanel/BookingPanel'
import { ContactSection } from '../components/Contact/ContactSection'
import { DestinationsSection } from '../components/Destinations/DestinationsSection'
import { Hero } from '../components/Hero/Hero'
import { PackagesSection } from '../components/Packages/PackagesSection'
import { PartnerMarquee } from '../components/PartnerMarquee/PartnerMarquee'
import { StorySection } from '../components/Story/StorySection'
import { TravelFilmSection } from '../components/TravelFilm/TravelFilmSection'
import { WeatherAlertsSection } from '../components/WeatherAlerts/WeatherAlertsSection'
import {
  clearHomeWeather,
  fetchHomePublicData,
  fetchHomeWeather,
  selectHome,
} from '../store/homeSlice'

const ALL_DESTINATIONS_VALUE = 'Tat ca'

function HomePage() {
  const dispatch = useAppDispatch()
  const {
    destinations,
    tours,
    forecasts,
    alerts,
    crowdPredictions,
    loading,
    weatherLoading,
    error,
    weatherError,
  } = useAppSelector(selectHome)
  const [destination, setDestination] = useState(ALL_DESTINATIONS_VALUE)
  const [travelDate, setTravelDate] = useState('')
  const [guests, setGuests] = useState(2)
  const [selectedTour, setSelectedTour] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    void dispatch(fetchHomePublicData())
  }, [dispatch])

  const selectedDestination = useMemo(() => {
    if (destination === ALL_DESTINATIONS_VALUE) {
      return ALL_DESTINATIONS_VALUE
    }

    return destinations.some(
      (item) => item.name.toLowerCase() === destination.toLowerCase(),
    )
      ? destination
      : ALL_DESTINATIONS_VALUE
  }, [destination, destinations])

  const selectedTourValue = useMemo(() => {
    if (tours.length === 0) {
      return ''
    }

    return selectedTour && tours.some((tour) => tour.title === selectedTour)
      ? selectedTour
      : tours[0].title
  }, [selectedTour, tours])

  const visibleTours = useMemo(() => {
    if (selectedDestination === ALL_DESTINATIONS_VALUE) {
      return tours
    }

    const matchedTours = tours.filter((tour) =>
      [tour.location, tour.title, tour.category, tour.description]
        .filter((item): item is string => Boolean(item))
        .some((item) =>
          item.toLowerCase().includes(selectedDestination.toLowerCase()),
        ),
    )

    return matchedTours
  }, [selectedDestination, tours])

  const destinationOptions = useMemo(
    () => destinations.map((item) => item.name).filter(Boolean),
    [destinations],
  )
  const heroDestinations = useMemo(
    () => destinations.filter((item) => Boolean(item.image)),
    [destinations],
  )

  const weatherDestination = useMemo(() => {
    if (selectedDestination !== ALL_DESTINATIONS_VALUE) {
      return destinations.find(
        (item) => item.name.toLowerCase() === selectedDestination.toLowerCase(),
      )
    }

    return destinations.find((item) => item.uuid)
  }, [selectedDestination, destinations])

  useEffect(() => {
    if (!weatherDestination?.uuid) {
      dispatch(clearHomeWeather())
      return
    }

    void dispatch(fetchHomeWeather(weatherDestination.uuid))
  }, [dispatch, weatherDestination?.uuid])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  const handleSelectTour = (tourTitle: string) => {
    setSelectedTour(tourTitle)
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (loading && destinations.length === 0 && tours.length === 0) {
    return (
      <>
        <PageLoader />
        <Footer />
        <LoginWelcomeAnimation />
      </>
    )
  }

  if (error && destinations.length === 0 && tours.length === 0) {
    return (
      <>
        <ErrorBlock message={error} />
        <Footer />
        <LoginWelcomeAnimation />
      </>
    )
  }

  return (
    <>
      {heroDestinations.length > 0 ? (
        <Hero destinations={heroDestinations} />
      ) : (
        <EmptyState
          title="Chua co anh diem den tu backend."
          message="Kiem tra truong coverImageUrl trong response GET /destinations."
        />
      )}
      <PartnerMarquee />
      <BookingPanel
        destination={selectedDestination}
        destinationOptions={destinationOptions}
        travelDate={travelDate}
        guests={guests}
        onDestinationChange={setDestination}
        onTravelDateChange={setTravelDate}
        onGuestsChange={setGuests}
        onSubmit={handleSubmit}
      />
      <WeatherAlertsSection
        destinationName={weatherDestination?.name}
        forecasts={forecasts}
        alerts={alerts}
        crowdPredictions={crowdPredictions}
        isLoading={weatherLoading}
        errorMessage={weatherError}
      />
      <AboutSection />
      {destinations.length > 0 ? (
        <DestinationsSection destinations={destinations} />
      ) : (
        <EmptyState title="Danh sach diem den dang trong." />
      )}
      <TravelFilmSection />
      {visibleTours.length > 0 ? (
        <PackagesSection tours={visibleTours} onSelectTour={handleSelectTour} />
      ) : (
        <EmptyState
          title="Chua co tour phu hop."
          message="Kiem tra endpoint GET /tours hoac bo loc diem den hien tai."
        />
      )}
      <StorySection />
      <ContactSection
        tours={tours}
        selectedTour={selectedTourValue}
        submitted={submitted}
        onTourChange={setSelectedTour}
        onSubmit={handleSubmit}
      />
      <Footer />
      <LoginWelcomeAnimation />
    </>
  )
}

export default HomePage

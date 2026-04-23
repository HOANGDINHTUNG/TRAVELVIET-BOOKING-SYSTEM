import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  fetchDestinationAlerts,
  fetchDestinationCrowdPredictions,
  fetchDestinationForecasts,
  fetchPublicDestinations,
  fetchPublicTours,
  type CrowdPrediction,
  type WeatherAlert,
  type WeatherForecast,
} from '../../../api/publicTravelApi'
import { AboutSection } from '../../../components/About/AboutSection'
import { BookingPanel } from '../../../components/BookingPanel/BookingPanel'
import { ContactSection } from '../../../components/Contact/ContactSection'
import { DestinationsSection } from '../../../components/Destinations/DestinationsSection'
import { Footer } from '../../../components/Footer/Footer'
import { Hero } from '../../../components/Hero/Hero'
import { LoginWelcomeAnimation } from '../../../components/LoginWelcome/LoginWelcomeAnimation'
import { PackagesSection } from '../../../components/Packages/PackagesSection'
import { PartnerMarquee } from '../../../components/PartnerMarquee/PartnerMarquee'
import { StorySection } from '../../../components/Story/StorySection'
import { TravelFilmSection } from '../../../components/TravelFilm/TravelFilmSection'
import { WeatherAlertsSection } from '../../../components/WeatherAlerts/WeatherAlertsSection'
import type { Destination, Tour } from '../../../data/travelData'
import {
  destinations as fallbackDestinations,
  tours as fallbackTours,
} from '../../../data/travelData'

function HomePage() {
  const [destination, setDestination] = useState('Tat ca')
  const [travelDate, setTravelDate] = useState('')
  const [guests, setGuests] = useState(2)
  const [selectedTour, setSelectedTour] = useState(fallbackTours[0].title)
  const [submitted, setSubmitted] = useState(false)
  const [destinations, setDestinations] = useState<Destination[]>(fallbackDestinations)
  const [tours, setTours] = useState<Tour[]>(fallbackTours)
  const [weatherForecasts, setWeatherForecasts] = useState<WeatherForecast[]>([])
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([])
  const [crowdPredictions, setCrowdPredictions] = useState<CrowdPrediction[]>([])
  const [isWeatherLoading, setIsWeatherLoading] = useState(false)

  const visibleTours = useMemo(() => {
    if (destination === 'Tat ca') {
      return tours
    }

    const matchedTours = tours.filter((tour) =>
      [tour.location, tour.title, tour.category, tour.description]
        .filter(Boolean)
        .some((item) =>
          item!.toLowerCase().includes(destination.toLowerCase()),
        ),
    )

    return matchedTours.length > 0 ? matchedTours : tours
  }, [destination, tours])

  const destinationOptions = useMemo(
    () => destinations.map((item) => item.name).filter(Boolean),
    [destinations],
  )

  const weatherDestination = useMemo(() => {
    if (destination !== 'Tat ca') {
      return destinations.find(
        (item) => item.name.toLowerCase() === destination.toLowerCase(),
      )
    }

    return destinations.find((item) => item.uuid) ?? destinations[0]
  }, [destination, destinations])

  useEffect(() => {
    let isMounted = true

    async function loadPublicData() {
      try {
        const [destinationResponse, tourResponse] = await Promise.all([
          fetchPublicDestinations(),
          fetchPublicTours(),
        ])

        if (!isMounted) {
          return
        }

        if (destinationResponse.length > 0) {
          setDestinations(destinationResponse)
        }

        if (tourResponse.length > 0) {
          setTours(tourResponse)
          setSelectedTour((current) =>
            tourResponse.some((tour) => tour.title === current)
              ? current
              : tourResponse[0].title,
          )
        }
      } catch {
        if (isMounted) {
          setDestinations(fallbackDestinations)
          setTours(fallbackTours)
        }
      }
    }

    void loadPublicData()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadWeather() {
      if (!weatherDestination?.uuid) {
        setWeatherForecasts([])
        setWeatherAlerts([])
        setCrowdPredictions([])
        return
      }

      setIsWeatherLoading(true)

      try {
        const [forecastResponse, alertResponse, crowdResponse] = await Promise.all([
          fetchDestinationForecasts(weatherDestination.uuid),
          fetchDestinationAlerts(weatherDestination.uuid),
          fetchDestinationCrowdPredictions(weatherDestination.uuid),
        ])

        if (!isMounted) {
          return
        }

        setWeatherForecasts(forecastResponse)
        setWeatherAlerts(alertResponse)
        setCrowdPredictions(crowdResponse)
      } catch {
        if (isMounted) {
          setWeatherForecasts([])
          setWeatherAlerts([])
          setCrowdPredictions([])
        }
      } finally {
        if (isMounted) {
          setIsWeatherLoading(false)
        }
      }
    }

    void loadWeather()

    return () => {
      isMounted = false
    }
  }, [weatherDestination?.uuid])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  const handleSelectTour = (tourTitle: string) => {
    setSelectedTour(tourTitle)
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Hero />
      <PartnerMarquee />
      <BookingPanel
        destination={destination}
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
        forecasts={weatherForecasts}
        alerts={weatherAlerts}
        crowdPredictions={crowdPredictions}
        isLoading={isWeatherLoading}
      />
      <AboutSection />
      <DestinationsSection destinations={destinations} />
      <TravelFilmSection />
      <PackagesSection tours={visibleTours} onSelectTour={handleSelectTour} />
      <StorySection />
      <ContactSection
        tours={tours}
        selectedTour={selectedTour}
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

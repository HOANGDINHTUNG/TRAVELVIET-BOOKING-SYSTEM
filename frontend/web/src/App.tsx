import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { AboutSection } from './components/About/AboutSection'
import { BookingPanel } from './components/BookingPanel/BookingPanel'
import { ContactSection } from './components/Contact/ContactSection'
import { DestinationsSection } from './components/Destinations/DestinationsSection'
import { FloatingUtilities } from './components/FloatingUtilities/FloatingUtilities'
import { Footer } from './components/Footer/Footer'
import { Hero } from './components/Hero/Hero'
import { Navbar } from './components/Navbar/Navbar'
import { PackagesSection } from './components/Packages/PackagesSection'
import { StatsStrip } from './components/StatsStrip/StatsStrip'
import { StorySection } from './components/Story/StorySection'
import { destinations, tours } from './data/travelData'
import { useAppSelector } from './hooks/redux'

function App() {
  const { i18n } = useTranslation()
  const { theme, language } = useAppSelector((state) => state.preferences)
  const [destination, setDestination] = useState('Tat ca')
  const [travelDate, setTravelDate] = useState('')
  const [guests, setGuests] = useState(2)
  const [selectedTour, setSelectedTour] = useState(tours[0].title)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    document.documentElement.lang = language
    void i18n.changeLanguage(language)
  }, [i18n, language])

  const visibleTours = useMemo(() => {
    if (destination === 'Tat ca') {
      return tours
    }

    return tours.filter((tour) =>
      tour.location.toLowerCase().includes(destination.toLowerCase()),
    )
  }, [destination])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  const handleSelectTour = (tourTitle: string) => {
    setSelectedTour(tourTitle)
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main
      className={`app-shell theme-${theme} lang-${language} min-h-screen`}
    >
      <Navbar />
      <Hero />
      <BookingPanel
        destination={destination}
        travelDate={travelDate}
        guests={guests}
        onDestinationChange={setDestination}
        onTravelDateChange={setTravelDate}
        onGuestsChange={setGuests}
        onSubmit={handleSubmit}
      />
      <StatsStrip />
      <AboutSection />
      <DestinationsSection destinations={destinations} />
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
      <FloatingUtilities />
    </main>
  )
}

export default App

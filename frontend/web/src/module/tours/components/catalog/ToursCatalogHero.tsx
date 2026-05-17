type ToursCatalogHeroProps = {
  title: string
  lead: string
}

export function ToursCatalogHero({ title, lead }: ToursCatalogHeroProps) {
  return (
    <header className="tours-vt-hero" aria-labelledby="tours-catalog-title">
      <div className="tours-vt-hero-inner">
        <h1 id="tours-catalog-title">{title}</h1>
        <p>{lead}</p>
      </div>
    </header>
  )
}

type DestinationSectionTitleProps = {
  kicker: string
  title: string
}

export function DestinationSectionTitle({
  kicker,
  title,
}: DestinationSectionTitleProps) {
  return (
    <div className="destination-detail-section-title">
      <p className="destination-detail-kicker">{kicker}</p>
      <h2>{title}</h2>
    </div>
  )
}

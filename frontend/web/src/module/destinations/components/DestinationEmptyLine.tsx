type DestinationEmptyLineProps = {
  label: string
}

export function DestinationEmptyLine({ label }: DestinationEmptyLineProps) {
  return <p className="destination-detail-empty">{label}</p>
}

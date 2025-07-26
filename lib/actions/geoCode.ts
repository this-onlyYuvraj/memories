interface GeocodeResults {
  country: string
  formattedAddress: string
}

export async function getCountryFromCoordinates(
  lat: number,
  lng: number
): Promise<GeocodeResults> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
  )
  const data = await response.json()
  const result = data.results?.[0]
  if (!result) {
    return {
      country: "Unknown",
      formattedAddress: "Unknown address",
    }
  }

  const countryComponent = result.address_components?.find((comp: any) =>
    comp.types.includes("country")
  )

  return {
    country: countryComponent?.long_name || "Unknown",
    formattedAddress: result.formatted_address || "Unknown address",
  }
}

declare namespace kakao {
  namespace maps {
    function load(callback: () => void): void

    class LatLng {
      constructor(lat: number, lng: number)
      getLat(): number
      getLng(): number
    }

    class Map {
      constructor(container: HTMLElement, options: MapOptions)
      setCenter(latlng: LatLng): void
      getCenter(): LatLng
      setLevel(level: number): void
      getLevel(): number
    }

    interface MapOptions {
      center: LatLng
      level: number
    }

    class Marker {
      constructor(options: MarkerOptions)
      setMap(map: Map | null): void
    }

    interface MarkerOptions {
      position: LatLng
      map?: Map
    }

    class CustomOverlay {
      constructor(options: CustomOverlayOptions)
      setMap(map: Map | null): void
      getMap(): Map | null
    }

    interface CustomOverlayOptions {
      position: LatLng
      content: string | HTMLElement
      map?: Map
      yAnchor?: number
      xAnchor?: number
      zIndex?: number
    }

    class Size {
      constructor(width: number, height: number)
    }

    namespace event {
      function addListener(
        target: Map | Marker | CustomOverlay,
        type: string,
        handler: (...args: unknown[]) => void
      ): void
    }

    namespace services {
      class Geocoder {
        addressSearch(
          address: string,
          callback: (result: GeocoderResult[], status: Status) => void
        ): void
      }

      interface GeocoderResult {
        address_name: string
        x: string
        y: string
      }

      enum Status {
        OK = 'OK',
        ZERO_RESULT = 'ZERO_RESULT',
        ERROR = 'ERROR',
      }
    }
  }
}

interface Window {
  kakao: typeof kakao
  daum: {
    Postcode: new (options: {
      oncomplete: (data: DaumPostcodeResult) => void
      onclose?: () => void
    }) => { open: () => void }
  }
}

interface DaumPostcodeResult {
  zonecode: string
  address: string
  roadAddress: string
  jibunAddress: string
  sigungu?: string
  sido?: string
  buildingName?: string
}

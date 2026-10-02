"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

type Listing = {
  id: number;
  title: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  host: string;
};

const listings: Listing[] = [
  {
    id: 1,
    title: "Quiet apartment with a city view",
    location: "Hyderabad, Telangana",
    description:
      "A comfortable apartment in a convenient part of Hyderabad. It is a good choice for short stays, work trips, or a relaxing weekend.",
    price: 2800,
    rating: 4.86,
    reviews: 124,
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    host: "Rahul",
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
    ],
  },
  {
    id: 2,
    title: "Modern stay near the city",
    location: "Hyderabad, Telangana",
    description:
      "A modern and comfortable place with everything you need for a pleasant stay.",
    price: 3200,
    rating: 4.72,
    reviews: 98,
    guests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    host: "Ananya",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
    ],
  },
  {
    id: 3,
    title: "Cozy home for a weekend",
    location: "Gachibowli, Hyderabad",
    description:
      "A peaceful home with a comfortable interior and easy access to nearby areas.",
    price: 2500,
    rating: 4.91,
    reviews: 76,
    guests: 4,
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    host: "Priya",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
    ],
  },
];

export default function ListingPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const listingId = Number(params.id);

  const listing =
    listings.find((item) => item.id === listingId) || listings[0];

  /*
   * Values selected on the homepage are passed through the URL.
   * Example:
   * /listing/1?checkIn=2026-09-18&checkOut=2026-09-22&guests=2
   */
  const [checkIn, setCheckIn] = useState(
    searchParams.get("checkIn") || ""
  );

  const [checkOut, setCheckOut] = useState(
    searchParams.get("checkOut") || ""
  );

  const [guestCount, setGuestCount] = useState(
    Number(searchParams.get("guests")) || 1
  );

  const [showTour, setShowTour] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const calculateNights = () => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const start = new Date(`${checkIn}T00:00:00`);
    const end = new Date(`${checkOut}T00:00:00`);

    const difference = end.getTime() - start.getTime();

    const nights = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();

  const totalPrice = listing.price * nights;

  const handleReserve = () => {
    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    const start = new Date(`${checkIn}T00:00:00`);
    const end = new Date(`${checkOut}T00:00:00`);

    if (end <= start) {
      alert("Check-out date must be after the check-in date.");
      return;
    }

    if (guestCount > listing.guests) {
      alert(
        `This property allows up to ${listing.guests} guests.`
      );
      return;
    }

    const bookingDetails = new URLSearchParams({
      listingId: String(listing.id),
      checkIn,
      checkOut,
      guests: String(guestCount),
      nights: String(nights),
      total: String(totalPrice),
    });

    router.push(`/checkout?${bookingDetails.toString()}`);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showPreviousImage = () => {
    if (lightboxIndex === null) {
      return;
    }

    setLightboxIndex(
      lightboxIndex === 0
        ? listing.images.length - 1
        : lightboxIndex - 1
    );
  };

  const showNextImage = () => {
    if (lightboxIndex === null) {
      return;
    }

    setLightboxIndex(
      lightboxIndex === listing.images.length - 1
        ? 0
        : lightboxIndex + 1
    );
  };

  useEffect(() => {
    if (lightboxIndex === null) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  const dateSummary = useMemo(() => {
    if (!checkIn || !checkOut || nights <= 0) {
      return "Select dates";
    }

    const start = new Date(`${checkIn}T00:00:00`);
    const end = new Date(`${checkOut}T00:00:00`);

    const formatDate = (date: Date) =>
      date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });

    return `${formatDate(start)} – ${formatDate(end)}`;
  }, [checkIn, checkOut, nights]);

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HEADER */}

      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

          <button
            onClick={() => router.push("/")}
            className="text-2xl font-bold tracking-tight text-[#ff385c]"
          >
            staynest
          </button>

          <div className="flex items-center gap-3">

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="rounded-full px-4 py-2 text-sm font-medium underline underline-offset-4 hover:bg-gray-100"
            >
              {isFavorite ? "♥ Saved" : "♡ Save"}
            </button>

            <button
              onClick={() => router.push("/")}
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Back to home
            </button>

          </div>

        </div>
      </header>

      {/* MAIN */}

      <section className="mx-auto max-w-7xl px-5 py-8">

        {/* TITLE */}

        <div className="mb-6">

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {listing.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">

            <span className="font-semibold">
              ★ {listing.rating}
            </span>

            <span>·</span>

            <button className="font-semibold underline">
              {listing.reviews} reviews
            </button>

            <span>·</span>

            <button className="font-semibold underline">
              {listing.location}
            </button>

          </div>

        </div>

        {/* PHOTO GRID */}

        <div className="relative">

          <div className="grid h-[520px] grid-cols-1 gap-2 overflow-hidden rounded-3xl md:grid-cols-4 md:grid-rows-2">

            {/* MAIN PHOTO */}

            <button
              onClick={() => openLightbox(0)}
              className="group relative overflow-hidden md:col-span-2 md:row-span-2"
            >
              <img
                src={listing.images[0]}
                alt={`${listing.title} main view`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
            </button>

            {/* SECOND PHOTO */}

            <button
              onClick={() => openLightbox(1)}
              className="group relative hidden overflow-hidden md:block"
            >
              <img
                src={listing.images[1]}
                alt={`${listing.title} interior`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </button>

            {/* THIRD PHOTO */}

            <button
              onClick={() => openLightbox(2)}
              className="group relative hidden overflow-hidden md:block"
            >
              <img
                src={listing.images[2]}
                alt={`${listing.title} room`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </button>

            {/* FOURTH PHOTO */}

            <button
              onClick={() => openLightbox(3)}
              className="group relative hidden overflow-hidden md:block"
            >
              <img
                src={listing.images[3]}
                alt={`${listing.title} living area`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </button>

            {/* FIFTH PHOTO */}

            <button
              onClick={() => openLightbox(4)}
              className="group relative hidden overflow-hidden md:block"
            >
              <img
                src={listing.images[4]}
                alt={`${listing.title} bedroom`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </button>

          </div>

          {/* SHOW ALL PHOTOS */}

          <button
            onClick={() => setShowTour(true)}
            className="absolute bottom-5 right-5 rounded-xl border border-white bg-white px-5 py-3 text-sm font-semibold shadow-lg transition hover:bg-gray-100"
          >
            ▦ Show all photos
          </button>

        </div>

        {/* CONTENT */}

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px]">

          {/* LEFT */}

          <div>

            {/* PROPERTY SUMMARY */}

            <div className="border-b border-gray-200 pb-8">

              <h2 className="text-2xl font-semibold">
                {listing.location}
              </h2>

              <p className="mt-3 text-gray-600">
                {listing.guests} guests · {listing.bedrooms} bedrooms ·{" "}
                {listing.beds} beds · {listing.bathrooms} bathrooms
              </p>

            </div>

            {/* HOST */}

            <div className="flex items-center gap-4 border-b border-gray-200 py-8">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-xl font-semibold">
                {listing.host.charAt(0)}
              </div>

              <div>

                <h2 className="font-semibold">
                  Hosted by {listing.host}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Host on StayNest
                </p>

              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="border-b border-gray-200 py-8">

              <h2 className="text-xl font-semibold">
                About this place
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-gray-600">
                {listing.description}
              </p>

            </div>

            {/* AMENITIES */}

            <div className="border-b border-gray-200 py-8">

              <h2 className="text-xl font-semibold">
                What this place offers
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-gray-200 p-4">
                  🛏️ Comfortable beds
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  📶 Free Wi-Fi
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  🚗 Free parking
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  🧺 Washing machine
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  🍳 Kitchen
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  ❄️ Air conditioning
                </div>

              </div>

            </div>

            {/* LOCATION */}

            <div className="py-8">

              <h2 className="text-xl font-semibold">
                Where you'll be
              </h2>

              <div className="mt-5 flex h-64 items-center justify-center rounded-2xl bg-gray-100">

                <div className="text-center">

                  <div className="text-4xl">
                    📍
                  </div>

                  <p className="mt-3 font-semibold">
                    {listing.location}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Approximate location shown
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* BOOKING CARD */}

          <aside className="h-fit lg:sticky lg:top-24">

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">

              <div className="flex items-center justify-between">

                <div>

                  <span className="text-2xl font-bold">
                    ₹{listing.price.toLocaleString("en-IN")}
                  </span>

                  <span className="ml-1 text-gray-600">
                    night
                  </span>

                </div>

                <div className="text-sm">
                  ★ {listing.rating}
                </div>

              </div>

              {/* DATE BOX */}

              <div className="mt-6 overflow-hidden rounded-xl border border-gray-300">

                <div className="grid grid-cols-2">

                  <div className="border-r border-gray-300 p-4">

                    <label
                      htmlFor="checkin"
                      className="block text-xs font-bold uppercase"
                    >
                      Check in
                    </label>

                    <input
                      id="checkin"
                      type="date"
                      value={checkIn}
                      onChange={(event) =>
                        setCheckIn(event.target.value)
                      }
                      className="mt-2 w-full text-sm outline-none"
                    />

                  </div>

                  <div className="p-4">

                    <label
                      htmlFor="checkout"
                      className="block text-xs font-bold uppercase"
                    >
                      Check out
                    </label>

                    <input
                      id="checkout"
                      type="date"
                      value={checkOut}
                      min={checkIn || undefined}
                      onChange={(event) =>
                        setCheckOut(event.target.value)
                      }
                      className="mt-2 w-full text-sm outline-none"
                    />

                  </div>

                </div>

                {/* GUESTS */}

                <div className="border-t border-gray-300 p-4">

                  <label
                    htmlFor="guests"
                    className="block text-xs font-bold uppercase"
                  >
                    Guests
                  </label>

                  <select
                    id="guests"
                    value={guestCount}
                    onChange={(event) =>
                      setGuestCount(Number(event.target.value))
                    }
                    className="mt-2 w-full bg-white text-sm outline-none"
                  >
                    {Array.from(
                      { length: listing.guests },
                      (_, index) => index + 1
                    ).map((number) => (
                      <option key={number} value={number}>
                        {number}{" "}
                        {number === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>

                </div>

              </div>

              {/* RESERVE */}

              <button
                onClick={handleReserve}
                className="mt-6 w-full rounded-xl bg-[#ff385c] py-4 text-lg font-semibold text-white transition hover:bg-[#e31c5f] active:scale-[0.99]"
              >
                Reserve
              </button>

              <p className="mt-3 text-center text-sm text-gray-500">
                You won't be charged yet
              </p>

              {/* PRICE */}

              {nights > 0 && (
                <div className="mt-6 border-t border-gray-200 pt-6">

                  <div className="flex justify-between text-sm">

                    <span>
                      ₹{listing.price.toLocaleString("en-IN")} ×{" "}
                      {nights}{" "}
                      {nights === 1 ? "night" : "nights"}
                    </span>

                    <span>
                      ₹{totalPrice.toLocaleString("en-IN")}
                    </span>

                  </div>

                  <div className="mt-5 flex justify-between border-t border-gray-200 pt-5 font-bold">

                    <span>
                      Total
                    </span>

                    <span>
                      ₹{totalPrice.toLocaleString("en-IN")}
                    </span>

                  </div>

                </div>
              )}

              {/* DATE SUMMARY */}

              <div className="mt-5 rounded-xl bg-gray-50 p-4 text-center text-sm text-gray-600">

                <span>
                  {dateSummary}
                </span>

              </div>

            </div>

          </aside>

        </div>

      </section>

      {/* PHOTO TOUR */}

      {showTour && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white">

          <div className="sticky top-0 z-20 border-b border-gray-200 bg-white">

            <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

              <h2 className="text-xl font-semibold">
                Photo tour
              </h2>

              <button
                onClick={() => setShowTour(false)}
                className="rounded-full border border-gray-300 px-4 py-2 font-medium hover:bg-gray-100"
              >
                ✕ Close
              </button>

            </div>

          </div>

          <div className="mx-auto max-w-6xl px-5 py-8">

            <div className="grid gap-5 md:grid-cols-2">

              {listing.images.map((image, index) => (

                <button
                  key={image}
                  onClick={() => {
                    setShowTour(false);
                    openLightbox(index);
                  }}
                  className="group overflow-hidden rounded-2xl text-left"
                >

                  <img
                    src={image}
                    alt={`${listing.title} photo ${index + 1}`}
                    className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />

                  <p className="mt-2 text-sm font-medium">
                    Photo {index + 1}
                  </p>

                </button>

              ))}

            </div>

          </div>

        </div>
      )}

      {/* LIGHTBOX */}

      {lightboxIndex !== null && (

        <div
          className="fixed inset-0 z-[60] flex flex-col bg-black"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >

          {/* TOP BAR */}

          <div className="flex items-center justify-between px-5 py-4 text-white">

            <p className="text-sm font-medium">
              {lightboxIndex + 1} / {listing.images.length}
            </p>

            <button
              onClick={closeLightbox}
              className="rounded-full px-4 py-2 text-xl hover:bg-white/10"
              aria-label="Close photo viewer"
            >
              ✕
            </button>

          </div>

          {/* IMAGE AREA */}

          <div className="relative flex flex-1 items-center justify-center px-16 pb-8">

            {/* PREVIOUS */}

            <button
              onClick={showPreviousImage}
              className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-lg transition hover:scale-105"
              aria-label="Previous photo"
            >
              ←
            </button>

            {/* IMAGE */}

            <img
              src={listing.images[lightboxIndex]}
              alt={`${listing.title} photo ${lightboxIndex + 1}`}
              className="max-h-[75vh] max-w-[90vw] object-contain"
            />

            {/* NEXT */}

            <button
              onClick={showNextImage}
              className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-lg transition hover:scale-105"
              aria-label="Next photo"
            >
              →
            </button>

          </div>

          {/* THUMBNAILS */}

          <div className="overflow-x-auto border-t border-white/10 px-5 py-4">

            <div className="mx-auto flex w-max gap-3">

              {listing.images.map((image, index) => (

                <button
                  key={image}
                  onClick={() => setLightboxIndex(index)}
                  className={`h-16 w-20 overflow-hidden rounded-lg border-2 transition ${
                    lightboxIndex === index
                      ? "border-white"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`View photo ${index + 1}`}
                >

                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover"
                  />

                </button>

              ))}

            </div>

          </div>

        </div>

      )}

      {/* FOOTER */}

      <footer className="border-t border-gray-200">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © 2026 StayNest. Built for a better way to find a stay.
          </p>

          <div className="flex gap-5">

            <button className="hover:text-gray-900">
              Privacy
            </button>

            <button className="hover:text-gray-900">
              Terms
            </button>

            <button className="hover:text-gray-900">
              Support
            </button>

          </div>

        </div>

      </footer>

    </main>
  );
}
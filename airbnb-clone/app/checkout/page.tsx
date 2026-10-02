"use client";

import { Suspense, type FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Booking = {
  id: string;
  listingId: number;
  title: string;
  location: string;
  image: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  total: number;
  status: "confirmed";
  bookedAt: string;
};

const STORAGE_KEY = "staynest_bookings";

const listings = [
  {
    id: 1,
    title: "Quiet apartment with a city view",
    location: "Hyderabad, Telangana",
    price: 2800,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Modern stay near the city",
    location: "Hyderabad, Telangana",
    price: 3200,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Cozy home for a weekend",
    location: "Gachibowli, Hyderabad",
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  },
];

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* -----------------------------
     GET BOOKING DETAILS
  ----------------------------- */

  const listingId = Number(searchParams.get("listingId")) || 1;

  const listing =
    listings.find((item) => item.id === listingId) || listings[0];

  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";

  const guests = Math.max(
    1,
    Number(searchParams.get("guests")) || 1
  );

  const nightsFromUrl =
    Number(searchParams.get("nights")) || 0;

  const nights = useMemo(() => {
    if (nightsFromUrl > 0) {
      return nightsFromUrl;
    }

    if (!checkIn || !checkOut) {
      return 0;
    }

    const start = new Date(`${checkIn}T00:00:00`);
    const end = new Date(`${checkOut}T00:00:00`);

    const difference =
      end.getTime() - start.getTime();

    return Math.max(
      0,
      Math.ceil(
        difference / (1000 * 60 * 60 * 24)
      )
    );
  }, [checkIn, checkOut, nightsFromUrl]);

  const totalFromUrl =
    Number(searchParams.get("total")) || 0;

  const total =
    totalFromUrl > 0
      ? totalFromUrl
      : listing.price * nights;

  /* -----------------------------
     FORM STATE
  ----------------------------- */

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  /* -----------------------------
     DATE FORMAT
  ----------------------------- */

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return "Not selected";
    }

    const date = new Date(
      `${dateString}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /* -----------------------------
     PAYMENT
  ----------------------------- */

  const handlePayment = (event: FormEvent) => {
    event.preventDefault();

    setError("");

    /* Validate booking information */

    if (!checkIn || !checkOut) {
      setError(
        "Please select check-in and check-out dates."
      );
      return;
    }

    if (nights <= 0) {
      setError(
        "Check-out date must be after check-in date."
      );
      return;
    }

    if (guests < 1) {
      setError("Please select at least 1 guest.");
      return;
    }

    /* Validate customer information */

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    /* Validate payment information */

    if (!cardNumber.trim()) {
      setError("Please enter your card number.");
      return;
    }

    if (!expiry.trim()) {
      setError("Please enter your card expiry date.");
      return;
    }

    if (!cvv.trim()) {
      setError("Please enter your CVV.");
      return;
    }

    setLoading(true);

    /*
     * Demo payment.
     * No real payment is processed.
     */

    setTimeout(() => {
      try {
        /* -----------------------------
           CREATE COMPLETE BOOKING
        ----------------------------- */

        const booking: Booking = {
          id: `booking-${Date.now()}`,

          listingId: listing.id,

          title: listing.title,

          location: listing.location,

          image: listing.image,

          checkIn,

          checkOut,

          guests,

          nights,

          pricePerNight: listing.price,

          total,

          status: "confirmed",

          bookedAt: new Date().toISOString(),
        };

        /* -----------------------------
           GET EXISTING BOOKINGS
        ----------------------------- */

        const existingBookings =
          localStorage.getItem(STORAGE_KEY);

        let bookings: Booking[] = [];

        if (existingBookings) {
          try {
            const parsed =
              JSON.parse(existingBookings);

            if (Array.isArray(parsed)) {
              bookings = parsed;
            }
          } catch {
            bookings = [];
          }
        }

        /* -----------------------------
           ADD NEW BOOKING
        ----------------------------- */

        bookings.push(booking);

        /* -----------------------------
           SAVE TO LOCAL STORAGE
        ----------------------------- */

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(bookings)
        );

        setLoading(false);
        setConfirmed(true);
      } catch (error) {
        console.error(
          "Booking could not be saved:",
          error
        );

        setLoading(false);

        setError(
          "Something went wrong while saving your booking. Please try again."
        );
      }
    }, 1000);
  };

  /* =====================================================
     BOOKING CONFIRMATION SCREEN
  ===================================================== */

  if (confirmed) {
    return (
      <main className="min-h-screen bg-white text-gray-900">

        {/* HEADER */}

        <header className="border-b border-gray-200">

          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

            <button
              onClick={() => router.push("/")}
              className="text-2xl font-bold tracking-tight text-[#ff385c]"
            >
              staynest
            </button>

            <nav className="flex items-center gap-8 text-sm font-medium">

              <button
                onClick={() => router.push("/")}
                className="hover:text-[#ff385c]"
              >
                Stays
              </button>

              <button
                onClick={() => router.push("/my-trips")}
                className="hover:text-[#ff385c]"
              >
                My Trips
              </button>

              <span className="hidden sm:block">
                Experiences
              </span>

              <span className="hidden sm:block">
                About
              </span>

            </nav>

          </div>

        </header>

        {/* CONFIRMATION */}

        <div className="mx-auto max-w-3xl px-6 py-16">

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">

            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-600">
                ✓
              </div>

              <h1 className="mt-6 text-4xl font-bold">
                Booking confirmed
              </h1>

              <p className="mt-3 text-lg text-gray-600">
                Your stay has been successfully booked.
              </p>

            </div>

            {/* BOOKING SUMMARY */}

            <div className="mt-10 overflow-hidden rounded-2xl border border-gray-200">

              {/* IMAGE */}

              <img
                src={listing.image}
                alt={listing.title}
                className="h-64 w-full object-cover"
              />

              <div className="p-6">

                <h2 className="text-2xl font-bold">
                  {listing.title}
                </h2>

                <p className="mt-1 text-gray-500">
                  {listing.location}
                </p>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">

                  <div>
                    <p className="text-sm text-gray-500">
                      Check-in
                    </p>

                    <p className="mt-1 font-semibold">
                      {formatDate(checkIn)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Check-out
                    </p>

                    <p className="mt-1 font-semibold">
                      {formatDate(checkOut)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Guests
                    </p>

                    <p className="mt-1 font-semibold">
                      {guests}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Nights
                    </p>

                    <p className="mt-1 font-semibold">
                      {nights}
                    </p>
                  </div>

                </div>

                <div className="mt-7 border-t border-gray-200 pt-5">

                  <div className="flex items-center justify-between">

                    <span className="text-gray-600">
                      Price per night
                    </span>

                    <span className="font-semibold">
                      ₹
                      {listing.price.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                  <div className="mt-3 flex items-center justify-between">

                    <span className="text-lg font-bold">
                      Total paid
                    </span>

                    <span className="text-lg font-bold">
                      ₹
                      {total.toLocaleString("en-IN")}
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* BUTTONS */}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              <button
                onClick={() => router.push("/my-trips")}
                className="rounded-xl bg-[#ff385c] px-6 py-4 font-bold text-white transition hover:bg-[#e31c5f]"
              >
                View My Trips
              </button>

              <button
                onClick={() => router.push("/")}
                className="rounded-xl bg-black px-6 py-4 font-bold text-white transition hover:bg-gray-800"
              >
                Back to Home
              </button>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <footer className="border-t border-gray-200">

          <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-500">
            © 2026 StayNest. Built for a better way to find a stay.
          </div>

        </footer>

      </main>
    );
  }

  /* =====================================================
     CHECKOUT PAGE
  ===================================================== */

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      {/* HEADER */}

      <header className="border-b border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <button
            onClick={() => router.push("/")}
            className="text-2xl font-bold tracking-tight text-[#ff385c]"
          >
            staynest
          </button>

          <nav className="flex items-center gap-8 text-sm font-medium">

            <button
              onClick={() => router.push("/")}
              className="hover:text-[#ff385c]"
            >
              Stays
            </button>

            <button
              onClick={() => router.push("/my-trips")}
              className="hover:text-[#ff385c]"
            >
              My Trips
            </button>

            <span className="hidden sm:block">
              Experiences
            </span>

            <span className="hidden sm:block">
              About
            </span>

          </nav>

        </div>

      </header>

      {/* MAIN CONTENT */}

      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* BACK */}

        <button
          onClick={() => router.back()}
          className="mb-6 text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold">
          Confirm and pay
        </h1>

        <p className="mt-2 text-gray-500">
          Complete your payment to confirm your reservation.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* ==========================================
              PAYMENT FORM
          ========================================== */}

          <section className="lg:col-span-2">

            <form
              onSubmit={handlePayment}
              className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm"
            >

              {/* CUSTOMER INFORMATION */}

              <h2 className="text-xl font-bold">
                Your information
              </h2>

              <div className="mt-6 grid gap-5">

                {/* NAME */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#ff385c] focus:ring-1 focus:ring-[#ff385c]"
                  />

                </div>

                {/* EMAIL */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email address
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#ff385c] focus:ring-1 focus:ring-[#ff385c]"
                  />

                </div>

              </div>

              <div className="my-8 border-t border-gray-200" />

              {/* PAYMENT */}

              <h2 className="text-xl font-bold">
                Payment details
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                This is a demo payment form. No real payment is processed.
              </p>

              <div className="mt-6 grid gap-5">

                {/* CARD */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Card number
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(event) => {
                      const value =
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 16);

                      const formatted =
                        value.match(/.{1,4}/g)?.join(" ") ||
                        "";

                      setCardNumber(formatted);
                    }}
                    placeholder="1234 5678 9012 3456"
                    autoComplete="cc-number"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#ff385c] focus:ring-1 focus:ring-[#ff385c]"
                  />

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* EXPIRY */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Expiry
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      value={expiry}
                      onChange={(event) => {
                        const value =
                          event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4);

                        if (value.length >= 3) {
                          setExpiry(
                            `${value.slice(
                              0,
                              2
                            )}/${value.slice(2)}`
                          );
                        } else {
                          setExpiry(value);
                        }
                      }}
                      placeholder="MM/YY"
                      autoComplete="cc-exp"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#ff385c] focus:ring-1 focus:ring-[#ff385c]"
                    />

                  </div>

                  {/* CVV */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      CVV
                    </label>

                    <input
                      type="password"
                      inputMode="numeric"
                      value={cvv}
                      onChange={(event) => {
                        const value =
                          event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4);

                        setCvv(value);
                      }}
                      placeholder="123"
                      autoComplete="cc-csc"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#ff385c] focus:ring-1 focus:ring-[#ff385c]"
                    />

                  </div>

                </div>

              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* PAY BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full rounded-xl bg-[#ff385c] px-6 py-4 font-bold text-white transition hover:bg-[#e31c5f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Processing payment..."
                  : `Pay ₹${total.toLocaleString(
                      "en-IN"
                    )}`}
              </button>

            </form>

          </section>

          {/* ==========================================
              BOOKING SUMMARY
          ========================================== */}

          <aside>

            <div className="sticky top-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

              {/* IMAGE */}

              <img
                src={listing.image}
                alt={listing.title}
                className="h-52 w-full object-cover"
              />

              <div className="p-6">

                <h2 className="text-xl font-bold">
                  Your trip
                </h2>

                <h3 className="mt-5 text-lg font-semibold">
                  {listing.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {listing.location}
                </p>

                <div className="mt-6 space-y-4 text-sm">

                  {/* CHECK IN */}

                  <div className="flex justify-between gap-4">

                    <span className="text-gray-600">
                      Check-in
                    </span>

                    <span className="font-semibold text-right">
                      {formatDate(checkIn)}
                    </span>

                  </div>

                  {/* CHECK OUT */}

                  <div className="flex justify-between gap-4">

                    <span className="text-gray-600">
                      Check-out
                    </span>

                    <span className="font-semibold text-right">
                      {formatDate(checkOut)}
                    </span>

                  </div>

                  {/* GUESTS */}

                  <div className="flex justify-between gap-4">

                    <span className="text-gray-600">
                      Guests
                    </span>

                    <span className="font-semibold">
                      {guests}
                    </span>

                  </div>

                  {/* NIGHTS */}

                  <div className="flex justify-between gap-4">

                    <span className="text-gray-600">
                      Nights
                    </span>

                    <span className="font-semibold">
                      {nights}
                    </span>

                  </div>

                </div>

                <div className="my-6 border-t border-gray-200" />

                {/* PRICE */}

                <div className="flex justify-between gap-4">

                  <span className="text-gray-600">
                    ₹
                    {listing.price.toLocaleString(
                      "en-IN"
                    )}{" "}
                    × {nights} nights
                  </span>

                  <span className="font-semibold">
                    ₹
                    {(listing.price * nights).toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                <div className="mt-5 flex justify-between border-t border-gray-200 pt-5">

                  <span className="text-lg font-bold">
                    Total
                  </span>

                  <span className="text-lg font-bold">
                    ₹
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </div>

      {/* FOOTER */}

      <footer className="mt-10 border-t border-gray-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-500">
          © 2026 StayNest. Built for a better way to find a stay.
        </div>

      </footer>

    </main>
  );
}

/* =====================================================
   PAGE WRAPPER
   Suspense fixes useSearchParams build error
===================================================== */

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-white">

          <div className="text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#ff385c]" />

            <p className="mt-4 text-gray-600">
              Loading checkout...
            </p>

          </div>

        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
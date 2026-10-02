"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Booking = {
  id: string;
  listingId: number;
  title: string;
  location?: string;
  image?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  total: number;
  status?: "confirmed";
};

const STORAGE_KEY = "staynest_bookings";

export default function MyTripsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedBookings = localStorage.getItem(STORAGE_KEY);

      if (savedBookings) {
        const parsed = JSON.parse(savedBookings);

        if (Array.isArray(parsed)) {
          setBookings(parsed);
        } else {
          setBookings([]);
        }
      }
    } catch (error) {
      console.error("Could not load bookings:", error);
      setBookings([]);
    }

    setIsLoaded(true);
  }, []);

  const cancelTrip = (bookingId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this trip?"
    );

    if (!confirmed) return;

    const updatedBookings = bookings.filter(
      (booking) => booking.id !== bookingId
    );

    setBookings(updatedBookings);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedBookings)
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) {
      return "Not selected";
    }

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return "Not selected";
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatMoney = (amount?: number) => {
    return Number(amount ?? 0).toLocaleString("en-IN");
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HEADER */}
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">

          <button
            onClick={() => router.push("/")}
            className="text-2xl font-bold tracking-tight text-[#ff385c]"
          >
            staynest
          </button>

          <nav className="flex items-center gap-6 text-sm font-medium">

            <button
              onClick={() => router.push("/")}
              className="hover:text-[#ff385c]"
            >
              Stays
            </button>

            <button className="font-bold text-[#ff385c]">
              My Trips
            </button>

            <button className="hidden sm:block hover:text-[#ff385c]">
              Experiences
            </button>

            <button className="hidden sm:block hover:text-[#ff385c]">
              About
            </button>

          </nav>
        </div>
      </header>

      {/* CONTENT */}
      <section className="mx-auto max-w-5xl px-5 py-12">

        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            My Trips
          </h1>

          <p className="mt-3 text-lg text-gray-500">
            View and manage your upcoming stays.
          </p>
        </div>

        {/* LOADING */}
        {!isLoaded ? (
          <div className="rounded-2xl border border-gray-200 p-10 text-center">
            Loading your trips...
          </div>
        ) : bookings.length === 0 ? (

          /* NO BOOKINGS */
          <div className="rounded-2xl border border-gray-200 px-6 py-16 text-center">

            <div className="text-5xl">
              🧳
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              No trips yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              Your confirmed stays will appear here after you complete a
              booking.
            </p>

            <button
              onClick={() => router.push("/")}
              className="mt-7 rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
            >
              Explore stays
            </button>

          </div>

        ) : (

          /* BOOKINGS */
          <div className="space-y-6">

            {bookings.map((booking) => (

              <article
                key={booking.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >

                <div className="grid md:grid-cols-[280px_1fr]">

                  {/* IMAGE */}
                  <div className="h-64 bg-gray-100 md:h-full">

                    {booking.image ? (
                      <img
                        src={booking.image}
                        alt={booking.title || "Stay"}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-5xl">🏠</div>
                          <p className="mt-2 text-sm">
                            Property image
                          </p>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* DETAILS */}
                  <div className="p-6">

                    <div className="flex flex-wrap items-start justify-between gap-4">

                      <div>

                        <p className="text-sm font-semibold text-[#ff385c]">
                          Confirmed booking
                        </p>

                        <h2 className="mt-2 text-2xl font-bold">
                          {booking.title || "Your stay"}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          {booking.location || "Location unavailable"}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="text-sm text-gray-500">
                          Total paid
                        </p>

                        <p className="text-2xl font-bold">
                          ₹{formatMoney(booking.total)}
                        </p>

                      </div>

                    </div>

                    {/* TRIP INFORMATION */}
                    <div className="mt-7 grid gap-5 sm:grid-cols-2">

                      <div>
                        <p className="text-sm text-gray-500">
                          Check-in
                        </p>

                        <p className="mt-1 font-semibold">
                          {formatDate(booking.checkIn)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Check-out
                        </p>

                        <p className="mt-1 font-semibold">
                          {formatDate(booking.checkOut)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Guests
                        </p>

                        <p className="mt-1 font-semibold">
                          {Number(booking.guests ?? 0)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Nights
                        </p>

                        <p className="mt-1 font-semibold">
                          {Number(booking.nights ?? 0)}
                        </p>
                      </div>

                    </div>

                    {/* BOTTOM */}
                    <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-5">

                      <p className="text-sm text-gray-500">
                        ₹{formatMoney(booking.pricePerNight)} per night
                      </p>

                      <button
                        onClick={() => cancelTrip(booking.id)}
                        className="rounded-xl border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Cancel trip
                      </button>

                    </div>

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-gray-200">

        <div className="mx-auto max-w-7xl px-5 py-8 text-center text-sm text-gray-500">
          © 2026 StayNest. Built for a better way to find a stay.
        </div>

      </footer>

    </main>
  );
}
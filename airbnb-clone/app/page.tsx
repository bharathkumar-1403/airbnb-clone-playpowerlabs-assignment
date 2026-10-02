"use client";

import { useMemo, useState } from "react";

type Stay = {
  id: number;
  title: string;
  location: string;
  distance: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
};

const stays: Stay[] = [
  {
    id: 1,
    title: "Quiet apartment with a city view",
    location: "Hyderabad, Telangana",
    distance: "Near Banjara Hills",
    price: 2800,
    rating: 4.86,
    reviews: 124,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Modern studio in the heart of the city",
    location: "Hyderabad, Telangana",
    distance: "Near Jubilee Hills",
    price: 3200,
    rating: 4.91,
    reviews: 98,
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Cozy home with a peaceful balcony",
    location: "Secunderabad, Telangana",
    distance: "10 minutes from the city",
    price: 2400,
    rating: 4.78,
    reviews: 76,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    title: "Bright two-bedroom home",
    location: "Gachibowli, Hyderabad",
    distance: "Close to HITEC City",
    price: 3600,
    rating: 4.88,
    reviews: 143,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    title: "Simple and comfortable city stay",
    location: "Madhapur, Hyderabad",
    distance: "Walkable to local cafés",
    price: 2600,
    rating: 4.74,
    reviews: 61,
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    title: "Spacious home for families",
    location: "Kondapur, Hyderabad",
    distance: "Close to restaurants and shops",
    price: 4100,
    rating: 4.93,
    reviews: 187,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
  },
];

export default function Home() {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searched, setSearched] = useState(false);

  const filteredStays = useMemo(() => {
    if (!location.trim()) {
      return stays;
    }

    const search = location.toLowerCase();

    return stays.filter(
      (stay) =>
        stay.location.toLowerCase().includes(search) ||
        stay.title.toLowerCase().includes(search) ||
        stay.distance.toLowerCase().includes(search)
    );
  }, [location]);

  function toggleFavorite(id: number) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id]
    );
  }

  function handleSearch() {
    setSearched(true);

    document
      .getElementById("stays")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  function openListing(stayId: number) {
    const searchParams = new URLSearchParams();

    if (checkIn) {
      searchParams.set("checkIn", checkIn);
    }

    if (checkOut) {
      searchParams.set("checkOut", checkOut);
    }

    if (guests > 0) {
      searchParams.set("guests", String(guests));
    }

    const queryString = searchParams.toString();

    window.location.href = queryString
      ? `/listing/${stayId}?${queryString}`
      : `/listing/${stayId}`;
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HEADER */}
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">

          {/* LOGO */}
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="text-2xl font-bold tracking-tight text-[#ff385c]"
          >
            staynest
          </button>

          {/* NAVIGATION */}
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">

            <button
              onClick={() => {
                document
                  .getElementById("stays")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="transition hover:text-[#ff385c]"
            >
              Stays
            </button>

            <button
              onClick={() => alert("Experiences coming soon!")}
              className="transition hover:text-[#ff385c]"
            >
              Experiences
            </button>

            <button
              onClick={() => {
                window.location.href = "/my-trips";
              }}
              className="transition hover:text-[#ff385c]"
            >
              My Trips
            </button>

            <button
              onClick={() => alert("About StayNest")}
              className="transition hover:text-[#ff385c]"
            >
              About
            </button>

          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            <button
              onClick={() => alert("List your place coming soon!")}
              className="hidden rounded-full px-4 py-2 text-sm font-medium transition hover:bg-gray-100 md:block"
            >
              List your place
            </button>

            <button
              onClick={() => {
                window.location.href = "/my-trips";
              }}
              className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm shadow-sm transition hover:shadow-md"
            >
              <span className="text-lg">☰</span>
              <span className="hidden sm:inline">Menu</span>
            </button>

          </div>
        </div>
      </header>

      {/* SEARCH */}
      <section className="mx-auto max-w-7xl px-5 pt-7">

        <div className="rounded-2xl border border-gray-300 bg-white shadow-sm md:flex">

          {/* WHERE */}
          <div className="flex-1 border-b border-gray-200 px-6 py-4 md:border-b-0 md:border-r">

            <label className="block text-xs font-bold uppercase tracking-wide">
              Where
            </label>

            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Search destinations"
              className="mt-1 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />

          </div>

          {/* CHECK IN */}
          <div className="flex-1 border-b border-gray-200 px-6 py-4 md:border-b-0 md:border-r">

            <label className="block text-xs font-bold uppercase tracking-wide">
              Check in
            </label>

            <input
              type="date"
              value={checkIn}
              onChange={(event) => setCheckIn(event.target.value)}
              className="mt-1 w-full bg-transparent text-sm outline-none"
            />

          </div>

          {/* CHECK OUT */}
          <div className="flex-1 border-b border-gray-200 px-6 py-4 md:border-b-0 md:border-r">

            <label className="block text-xs font-bold uppercase tracking-wide">
              Check out
            </label>

            <input
              type="date"
              value={checkOut}
              min={checkIn || undefined}
              onChange={(event) => setCheckOut(event.target.value)}
              className="mt-1 w-full bg-transparent text-sm outline-none"
            />

          </div>

          {/* GUESTS */}
          <div className="flex-1 px-6 py-4">

            <label className="block text-xs font-bold uppercase tracking-wide">
              Guests
            </label>

            <div className="mt-1 flex items-center justify-between">

              <span className="text-sm text-gray-600">
                {guests === 0
                  ? "Add guests"
                  : `${guests} ${
                      guests === 1 ? "guest" : "guests"
                    }`}
              </span>

              <div className="flex items-center gap-2">

                <button
                  onClick={() =>
                    setGuests((current) =>
                      Math.max(0, current - 1)
                    )
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-sm hover:bg-gray-100"
                >
                  −
                </button>

                <button
                  onClick={() =>
                    setGuests((current) => current + 1)
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-sm hover:bg-gray-100"
                >
                  +
                </button>

              </div>
            </div>
          </div>

          {/* SEARCH BUTTON */}
          <div className="flex items-center px-4 pb-4 md:pb-0">

            <button
              onClick={handleSearch}
              className="w-full rounded-xl bg-[#ff385c] px-7 py-4 font-semibold text-white transition hover:bg-[#e51f45] md:w-auto"
            >
              Search
            </button>

          </div>

        </div>
      </section>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-5 py-12">

        <div className="overflow-hidden rounded-3xl bg-gray-100">

          <div className="grid items-center md:grid-cols-2">

            <div className="px-7 py-12 md:px-14">

              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#ff385c]">
                Find somewhere you will love
              </p>

              <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                Your next stay starts here.
              </h1>

              <p className="mt-5 max-w-lg text-lg leading-8 text-gray-600">
                Discover comfortable homes, welcoming spaces and places that
                make a trip feel a little more special.
              </p>

              <button
                onClick={() =>
                  document
                    .getElementById("stays")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="mt-8 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                Explore stays
              </button>

            </div>

            <div
              className="min-h-[350px] bg-cover bg-center md:min-h-[460px]"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80')",
              }}
            />

          </div>
        </div>
      </section>

      {/* LISTINGS */}
      <section
        id="stays"
        className="mx-auto max-w-7xl px-5 pb-16"
      >

        <div className="mb-7 flex items-end justify-between">

          <div>

            <h2 className="text-2xl font-bold md:text-3xl">
              Places you might like
            </h2>

            <p className="mt-2 text-gray-500">
              A few comfortable stays worth checking out.
            </p>

          </div>

          {searched && (
            <p className="hidden text-sm text-gray-500 sm:block">
              {filteredStays.length}{" "}
              {filteredStays.length === 1
                ? "place"
                : "places"}{" "}
              found
            </p>
          )}

        </div>

        {filteredStays.length === 0 ? (

          <div className="rounded-2xl border border-gray-200 px-6 py-16 text-center">

            <div className="text-4xl">🏠</div>

            <h3 className="mt-4 text-xl font-semibold">
              We couldn't find a match
            </h3>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              Try searching for another city, neighborhood or property type.
            </p>

            <button
              onClick={() => {
                setLocation("");
                setSearched(false);
              }}
              className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
            >
              Show all stays
            </button>

          </div>

        ) : (

          <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">

            {filteredStays.map((stay) => {

              const isFavorite = favorites.includes(stay.id);

              return (
                <article
                  key={stay.id}
                  className="group cursor-pointer"
                  onClick={() => openListing(stay.id)}
                >

                  <div className="relative overflow-hidden rounded-2xl">

                    <img
                      src={stay.image}
                      alt={stay.title}
                      className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavorite(stay.id);
                      }}
                      aria-label={
                        isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-lg shadow-sm transition hover:scale-105"
                    >
                      {isFavorite ? "♥" : "♡"}
                    </button>

                  </div>

                  <div className="mt-4">

                    <div className="flex items-start justify-between gap-3">

                      <h3 className="font-semibold">
                        {stay.title}
                      </h3>

                      <div className="flex shrink-0 items-center gap-1 text-sm">
                        <span>★</span>
                        <span>{stay.rating}</span>
                      </div>

                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      {stay.location}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {stay.distance}
                    </p>

                    <p className="mt-3 text-sm text-gray-500">
                      {stay.reviews} reviews
                    </p>

                    <p className="mt-2">

                      <span className="font-semibold">
                        ₹{stay.price.toLocaleString("en-IN")}
                      </span>

                      <span className="text-sm text-gray-500">
                        {" "}night
                      </span>

                    </p>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 bg-gray-50">

        <div className="mx-auto max-w-7xl px-5 py-16 text-center">

          <h2 className="text-3xl font-bold">
            Looking for somewhere different?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            Whether you're planning a weekend away or a longer stay, there's
            always another place worth discovering.
          </p>

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="mt-7 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Start a new search
          </button>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 px-5 py-8">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-gray-500 md:flex-row">

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
import Link from "next/link";

export default function IntroSection() {

  return (
    <>
      <Link
        href="/"
        className="relative mx-auto block w-48 overflow-hidden rounded-lg bg-slate-200 shadow-xl shadow-slate-200 sm:w-64 sm:rounded-xl lg:w-auto lg:rounded-2xl"
        aria-label="Homepage"
      >

        <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 sm:rounded-xl lg:rounded-2xl" />
      </Link>
      <div className="text-centerlg:text-left">
        <p className="text-xl font-bold text-slate-900">
          <Link href="/">Content Generation</Link>
        </p>
        <p className="mt-3 text-lg font-medium leading-8 text-slate-700">
          By leveraging AI and GPT technology, you can easily design your campaign landing pages by simply inputting the campaign name.
        </p>
      </div>
    </>

  );
}

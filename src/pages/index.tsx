import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'
import React from 'react';
import DescriptionArea from '../components/DescriptionArea';
import GeneratedHTMLPage from '../components/GeneratedHTMLPage';
import IntroSection from '@/components/IntroSection'
import GeneratedSections from '@/components/GeneratedSections'
import { Item } from '@/types/Item'
import DownloadButton from '@/components/DownloadButton'


export default function Home() {
  const [html, setHtml] = useState('');
  const [generatedSections, setGeneratedSections] = useState<Item[]>([]);
  const appendToHtml = (newValue: any) => {
    setHtml((currentHtml) => currentHtml + newValue);
  };
  function handleGenerateHtml(generatedHtml: any) {
    appendToHtml(generatedHtml)
  }
  function handleGenerateSections(generatedItems: any) {
    setGeneratedSections(generatedItems)
  }
  
  return (
    <>
      <Head>
        <title>LandingPage GPT</title>
        <meta name="description" content="Craft a Professional Landing Page in Minutes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Eventhough tailwind play shouldn't be used in production, it's the perfect use case here since it enables the GPT engine to create whatever it wants and being able to preview it straight away*/}
        <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>

      </Head>
  
      <main className='flex flex-col justify-between items-center pb-24 pt-12 min-h-screen px-4 md:px-24'>
        <div className='flex flex-col'>
          <div className='mx-auto'>
            <h1 className="font-display inline mx-auto max-w-4xl text-4xl font-extrabold   tracking-normal text-gray-50 sm:text-5xl md:text-6xl">LandingPage </h1>
            <h1 className="font-display inline  mx-auto max-w-4xl text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-pink-600 tracking-normal text-gray-300 sm:text-5xl md:text-6xl">GPT</h1>
          </div>
          <h2 className='font-display py-4 mx-auto max-w-4xl text-2xl font-semibold bg-clip-text  tracking-normal text-gray-200 sm:text-3xl md:text-4xl'>Craft a Professional Landing Page in Minutes</h2>
          <h2 className=" mx-auto my-4 max-w-4xl text-lg  text-gray-300 leading-7">Unlock the power of GPT to effortlessly design a high-converting landing page for your business. Simply provide your campaign name, and watch as Landing Page GPT swiftly generates the full HTML code tailored to your needs.</h2>
        </div>
        <div className='flex flex-col md:flex-row justify-center gap-2'>
          <header className="bg-slate-50 lg:overflow-y-auto min-h-screen mb-auto rounded-lg">

            <div className="relative z-10 mx-auto flex flex-col gap-4 px-4 pb-4 pt-10 sm:px-6 md:max-w-2xl md:px-4 lg:min-h-full lg:flex-auto lg:border-x lg:border-slate-200 lg:py-12 lg:px-8 xl:px-12">
              <IntroSection></IntroSection>
              <DescriptionArea generatedSections={handleGenerateSections} ></DescriptionArea>
              
              <GeneratedSections setGeneratedItems={setGeneratedSections} generatedItems={generatedSections} generatedHTML={handleGenerateHtml}></GeneratedSections>
            </div>
          </header>

          <main className={html ? "border-t border-slate-200 lg:relative lg:border-t-0 flex-1" : "hidden"}>
            <GeneratedHTMLPage html={html}></GeneratedHTMLPage>
            <DownloadButton html={html}></DownloadButton>
          </main>

          <div className="fixed inset-x-0 bottom-0 z-10 lg:left-112 xl:left-120">

          </div>

        </div>

      </main>
    </>
  )
}

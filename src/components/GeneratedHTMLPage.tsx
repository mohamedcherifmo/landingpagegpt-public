'use client'
import React, { memo } from "react";
import Script from 'next/script'

type GeneratedHTMLPageProps = {
  html: string;
};

function GeneratedHTMLPage(props: GeneratedHTMLPageProps) {
  return (
    <>
        {props.html && <div id="landingPageResult" className="flex flex-col gap-8 p-4 bg-white rounded-lg" dangerouslySetInnerHTML={{ __html: props.html }}></div>}
    
    

    </>
  );
}

export default memo(GeneratedHTMLPage);

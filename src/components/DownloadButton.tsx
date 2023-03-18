import React, { memo, useCallback, useRef, Fragment, useState, useEffect } from "react";

import LoadingText from "./LoadingText";


type DownloadButtonProps = {
  html: any;
};

function DownloadButton(props: DownloadButtonProps) {
  const messageRef = useRef(null);
  const [generateDownloadHtmlLoading, setgenerateDownloadHtmlLoading] = useState<boolean>(false);

  const [generatedHtml, setgeneratedHtml] = useState<string>("");
  useEffect(() => {
    setgeneratedHtml(props.html);
  }, [props.html]);

  const handleDownloadHtml = useCallback(async () => {
    if (!generatedHtml || generatedHtml == "") {
      return;
    }
    setgenerateDownloadHtmlLoading(true);


    try {
      const blob = new Blob([generatedHtml], { type: 'text/html;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'onboarding_html.html';
      link.click();
      URL.revokeObjectURL(link.href);

    } catch (err: any) {
      setgenerateDownloadHtmlLoading(false);
    }

  }, [generateDownloadHtmlLoading]);

  return (
    <>
      <div className='flex flex-col gap-2 pb-4'>
        <button
          type="button" onClick={handleDownloadHtml}
          className="rounded-md ml-auto bg-indigo-700 py-1.5 px-2.5 mt-4 font-semibold  text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          {generateDownloadHtmlLoading ? (
            <LoadingText text="..." />
          ) : (
            <>
              <span>Download</span>
            </>
          )}

        </button>

      </div>

    </>
  );
}

export default memo(DownloadButton);

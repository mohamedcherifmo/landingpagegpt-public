import React, { memo, useCallback, useRef, Fragment, useState, useContext } from "react";
import axios from "axios";
import { Menu, Transition, RadioGroup } from '@headlessui/react'
import LoadingText from "./LoadingText";
import { CodeBracketIcon, EllipsisVerticalIcon, FlagIcon, StarIcon } from '@heroicons/react/20/solid'

import { Popover } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid'

type DescriptionAreaProps = {
  generatedSections: any;
};

function DescriptionArea(props: DescriptionAreaProps) {
  const messageRef = useRef(null);
  const [generateSectionLoading, setgenerateSectionLoading] = useState<boolean>(false);
  const [answerError, setAnswerError] = useState("");
  const handlegenerateSection = useCallback(async () => {
    if (generateSectionLoading) {
      return;
    }
    setgenerateSectionLoading(true);
    const message = (messageRef?.current as any)?.value ?? "";
    if (!message) {
      setAnswerError("Please enter a campaign.");
      setgenerateSectionLoading(false);
      return;
    }

    try {
      const data = {
        message: message,
      };
      axios.post('/api/generatecontentsections', data)
        .then(response => {
          let jsonArr = JSON.parse(response.data);
          for (let i = 0; i < jsonArr.length; i++) {
            jsonArr[i].dragging = false;
            jsonArr[i].isDraggingOver = false;
          }
          props.generatedSections(jsonArr);

          setgenerateSectionLoading(false);
        })
        .catch(error => {
          if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
          } else {
            console.log(error.message);
          }
          setgenerateSectionLoading(false);
        });

    } catch (err: any) {
      setgenerateSectionLoading(false);
    }

  }, [generateSectionLoading]);

  return (
    <>
      <div className='flex flex-col gap-2 pb-4'>
        <div className=" flex flex-col gap-2 ">
          <label htmlFor="description" className="block font-semibold leading-6 text-gray-900 sm:pt-1.5">
            Description
          </label>
          <div className="">
            <textarea
              id="description"
              name="description"
              rows={3}
              className="block w-full max-w-lg rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-2"
              defaultValue={''}
              ref={messageRef}
              required
            />
            <p className="mt-2 text-sm text-gray-500">Write the name of your campaign or a description.</p>
          </div>
        </div>
        <button
          type="button" onClick={handlegenerateSection}
          className="rounded-md ml-auto bg-indigo-700 py-1.5 px-2.5 mt-4 font-semibold  text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          {generateSectionLoading ? (
            <LoadingText text="..." />
          ) : (
            <>
              <span>Generate Sections</span>
            </>
          )}

        </button>
      </div>
      {answerError && <div className="text-red-500">{answerError}</div>}
    </>
  );
}

export default memo(DescriptionArea);

import React, { memo, useCallback, useRef, Fragment, useState, useEffect  } from "react";
import { Menu, Transition, RadioGroup } from '@headlessui/react'
import { CodeBracketIcon, EllipsisVerticalIcon, FlagIcon, StarIcon } from '@heroicons/react/20/solid'
import axios from "axios";
import LoadingText from "./LoadingText";
import { Popover } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid'
import { Item } from "@/types/Item";

type GeneratedSectionsProps = {
    generatedHTML: any;
    generatedItems:Item[];
    setGeneratedItems:any;
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }
  
  
export default function GeneratedSections(props: GeneratedSectionsProps) {

  const [editIndex, setEditIndex] = useState(null);
  const [newItem, setNewItem] = useState({ section: "", description: "", dragging: false, isDraggingOver: false });
  // const [items, setItems] = useState<Item[]>([]);
  const [generateLandingLoading, setgenerateLandingLoading] = useState<boolean>(false);
  const [generatedSections, setGeneratedSections] = useState<Item[]>(props.generatedItems);
  const [landing, setLanding] = useState("");
  const [landingError, setLandingError] = useState("");
  const [answerError, setAnswerError] = useState("");
  const [answer, setAnswer] = useState("");
  useEffect(() => {
    setGeneratedSections(props.generatedItems);
  }, [props.generatedItems]);
  const handlegenerateLanding = useCallback(async () => {
    if (generateLandingLoading) {
      return;
    }
    setLanding("");
    if (!generatedSections || generatedSections.length == 0) {
      setLandingError("Please enter a campaign.");
      return;
    }
    setgenerateLandingLoading(true);
    setLandingError("");
    try {
      
      const response = await fetch("/api/generatecomponents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: JSON.stringify(generatedSections)
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // This data is a ReadableStream
      const data = response.body;
      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);



        props.generatedHTML(chunkValue);
      }
      setgenerateLandingLoading(false);



    } catch (err: any) {
      setLandingError("Sorry, something went wrong!");
      setgenerateLandingLoading(false);
    }



  }, [generateLandingLoading, landing,generatedSections]);


  const handleDelete = (index: any) => {
    const newItems = [...generatedSections];
    newItems.splice(index, 1);
    setGeneratedSections(newItems);
  };

  const handleDragStart = (event: any, index: any, item: Item) => {

    setGeneratedSections((prevItems: any[]) => {
      // Map over the previous items array to update the dragging state
      return prevItems.map(prevItem =>
        prevItem.section === item.section ? { ...prevItem, dragging: true } : prevItem
      );
    });
    event.dataTransfer.setData("index", index);

  };

  const handleDragOver = (event: any, index: any, item: Item) => {

    event.preventDefault();
    setGeneratedSections((prevItems: any[]) => {
      // Map over the previous items array to update the dragging state
      return prevItems.map(prevItem =>
        prevItem.section === item.section ? { ...prevItem, isDraggingOver: true } : prevItem
      );
    });


  };

  const handleDrop = (event: any, index: any, item: Item) => {
    const dragIndex = event.dataTransfer.getData("index");
    const newItems = [...generatedSections];
    const draggedItem = newItems[dragIndex];
    newItems.splice(dragIndex, 1);
    newItems.splice(index, 0, draggedItem);
    for (let i = 0; i < newItems.length; i++) {
      newItems[i].dragging = false;
      newItems[i].isDraggingOver = false;

    }
    setGeneratedSections(newItems);
  };

  const handleEdit = (index: any) => {
    setEditIndex(index);
  };

  const handleSave = (index: any) => {
    const newItems = [...generatedSections] as any;
    newItems[index] = newItem;
    setGeneratedSections(newItems);
    setEditIndex(null);
    setNewItem({ section: "", description: "", dragging: false, isDraggingOver: false });
  };

  const handleCancel = () => {
    setEditIndex(null);
    setNewItem({ section: "", description: "", dragging: false, isDraggingOver: false });
  };

  const handleAdd = () => {
    const newItems = [...generatedSections, newItem];
    setGeneratedSections(newItems as any);
    setNewItem({ section: "", description: "", dragging: false, isDraggingOver: false });
  };

  const handleNewTitleChange = (event: any) => {
    setNewItem({ ...newItem, section: event.target.value });
  };

  const handleNewDescriptionChange = (event: any) => {
    setNewItem({ ...newItem, description: event.target.value });
  };

 

    return (
        <>
             {((generatedSections && generatedSections.length>0) || answerError) &&
        <div className="min-h-[5rem]  relative ">
          {answerError && <div className="text-red-500">{answerError}</div>}
          <Transition
            show={generatedSections !=null}
            enter="transition duration-600 ease-out"
            enterFrom="transform opacity-0"
            enterTo="transform opacity-100"
            leave="transition duration-125 ease-out"
            leaveFrom="transform opacity-100"
            leaveTo="transform opacity-0"
            className="mb-4"
          >

            {generatedSections && (
              <>

                <div className=" w-full   border-t border-gray-300 py-4">
                  <Popover className="relative">
                    {({ open }) => (
                      <>
                        <div className="flex justify-between">
                          <h2 className="text-xl font-bold text-slate-900">Sections</h2>
                          <Popover.Button
                            className={`
                ${open ? '' : 'text-opacity-90'}
                group inline-flex items-center rounded-md bg-indigo-700 hover:bg-indigo-600 py-1.5 px-2.5 font-semibold  text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                          >
                            <span>Add</span>
                            <ChevronDownIcon
                              className={`${open ? '' : 'text-opacity-70'}
                  ml-auto h-5 w-5 text-indigo-300 transition duration-150 ease-in-out group-hover:text-opacity-80`}
                              aria-hidden="true"
                            />
                          </Popover.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                          >
                            <Popover.Panel className="absolute left-0 z-10 mt-3 w-screen max-w-xs px-4 sm:px-0 bg-white">
                              <div className="overflow-hidden rounded-lg flex flex-col max-w-xs gap-2 p-4 shadow-lg ring-1 ring-black ring-opacity-5">
                                <input className="block w-full max-w-lg rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                  type="text"
                                  placeholder="New item title"
                                  value={newItem.section}
                                  onChange={handleNewTitleChange}
                                />
                                <textarea className="block w-full max-w-lg rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"

                                  placeholder="New item description"
                                  value={newItem.description}
                                  onChange={handleNewDescriptionChange}
                                />
                                <button className="py-1.5 px-2.5 rounded-md" onClick={handleAdd}>Add</button>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Popover>
                </div>
                <div className="flex flex-col gap-4  ">
                  {generatedSections.map((item: any, index: any) => (


                    <div className={`rounded-md relative bg-white border shadow border-gray-200 py-5 px-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 hover:bg-gray-50 cursor-move ${item.dragging ? "opacity-50 bg-gray-100 border border-blue-500" : "opacity-100 shadow bg-white border-gray-200"} ${item.isDraggingOver ? "border-4 bg-gray-200 shadow-lg border-gray-700 !border-dashed " : "border-solid"} `}
                      key={item.section}
                      draggable
                      onDragStart={(event) => handleDragStart(event, index, item)}
                      onDragOver={(event) => handleDragOver(event, index, item)}
                      onDrop={(event) => handleDrop(event, index, item)}
                    >
                      {editIndex === index ? (
                        <>
                          <div>
                            <input
                              type="text"
                              value={newItem.section}
                              onChange={handleNewTitleChange}
                            />
                            <input
                              type="text"
                              value={newItem.description}
                              onChange={handleNewDescriptionChange}
                            />
                            <button onClick={() => handleSave(index)}>Save</button>
                            <button onClick={handleCancel}>Cancel</button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex space-x-3">

                            <div className="min-w-0 flex-1">
                              <p className=" font-semibold text-gray-900">

                                {item.section}

                              </p>
                              <p className=" text-gray-500">

                                {item.description}

                              </p>
                            </div>
                            <div className="flex flex-shrink-0">
                              <Menu as="div" className="relative inline-block text-left">
                                <div>
                                  <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-400 hover:text-gray-600 bg-transparent">
                                    <span className="sr-only">Open options</span>
                                    <EllipsisVerticalIcon className="h-4 w-4" aria-hidden="true" />
                                  </Menu.Button>
                                </div>

                                <Transition
                                  as={Fragment}
                                  enter="transition ease-out duration-100"
                                  enterFrom="transform opacity-0 scale-95"
                                  enterTo="transform opacity-100 scale-100"
                                  leave="transition ease-in duration-75"
                                  leaveFrom="transform opacity-100 scale-100"
                                  leaveTo="transform opacity-0 scale-95"
                                >
                                  <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button onClick={() => handleEdit(index)}

                                            className={classNames(
                                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                              'flex px-4 py-2 text-sm w-full bg-transparent hover:bg-gray-100'
                                            )}
                                          >
                                            <PencilIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                            <span>Edit</span>
                                          </button>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            onClick={() => handleDelete(index)}
                                            className={classNames(
                                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                              'flex px-4 py-2 text-sm w-full bg-transparent hover:bg-gray-100'
                                            )}
                                          >
                                            <TrashIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                            <span>Delete</span>
                                          </button>
                                        )}
                                      </Menu.Item>

                                    </div>
                                  </Menu.Items>
                                </Transition>
                              </Menu>
                            </div>
                          </div>

                        </>

                      )}
                    </div>


                  ))}


                </div>
              </>
            )}


          </Transition>
          <button
            type="button" onClick={handlegenerateLanding}
            className="rounded-md ml-auto bg-indigo-700 py-1.5 px-2.5 font-semibold  text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            {generateLandingLoading ? (
              <LoadingText text="..." />
            ) : (
              <>

                <span >Generate Page</span>
              </>
            )}

          </button>
        </div>

      }
        </>

    );
}

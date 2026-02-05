import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Collapse, Tab, Modal, initTWE } from "tw-elements";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ProgressIcon from "../../../public/static/img/home/progress-icon.png";

// Assuming ProgressIcon is in your assets
// import ProgressIcon from "../../assets/progress-icon.png";

const CrudQuestion = () => {
  // 1. STATE MANAGEMENT
  const [questions, setQuestions] = useState([
    {
      id: "q1",
      text: "I feel comfortable asking questions or sharing concerns in my work environment.",
      role: "hr",
      domain: "engineering",
      code: "PS-01",
    },
    {
      id: "q2",
      text: "I trust that my colleagues and leaders respond respectfully when people speak up.",
      role: "engineering",
      domain: "marketing",
      code: "PS-02",
    },
  ]);

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [formData, setFormData] = useState({
    role: "",
    domain: "",
    subDomain: "",
    type: "",
    code: "",
    question: "",
    scale: "",
    prompt: "",
  });

  useEffect(() => {
    initTWE({ Tab, Collapse, Modal });
  }, []);

  // 2. MODAL TRIGGER HANDLERS
  const openAddModal = () => {
    setFormData({
      role: "",
      domain: "",
      subDomain: "",
      type: "",
      code: "",
      question: "",
      scale: "",
      prompt: "",
    });
    const modal = Modal.getOrCreateInstance(
      document.getElementById("addModal"),
    );
    modal.show();
  };

  const openEditModal = (q) => {
    setSelectedQuestion(q);
    setFormData({
      role: q.role || "",
      domain: q.domain || "",
      code: q.code || "",
      question: q.text || "",
      // ... map other fields accordingly
    });
    const modal = Modal.getOrCreateInstance(
      document.getElementById("editModal"),
    );
    modal.show();
  };

  const openDeleteModal = (q) => {
    setSelectedQuestion(q);
    const modal = Modal.getOrCreateInstance(
      document.getElementById("deleteModal"),
    );
    modal.show();
  };

  // 3. FUNCTIONAL ACTIONS
  const handleCreate = () => {
    const newQ = {
      id: `q-${Date.now()}`,
      text: formData.question,
      ...formData,
    };
    setQuestions([...questions, newQ]);
    Modal.getInstance(document.getElementById("addModal")).hide();
  };

  const handleUpdate = () => {
    setQuestions(
      questions.map((q) =>
        q.id === selectedQuestion.id
          ? { ...q, text: formData.question, ...formData }
          : q,
      ),
    );
    Modal.getInstance(document.getElementById("editModal")).hide();
  };

  const handleConfirmDelete = () => {
    setQuestions(questions.filter((q) => q.id !== selectedQuestion.id));
    Modal.getInstance(document.getElementById("deleteModal")).hide();
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setQuestions(items);
  };
  return (
    <div>
      <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-3 rounded-[12px] mt-6 min-h-[calc(100vh-152px)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="md:text-2xl text-xl font-bold">
              Assessment Questions
            </h2>
          </div>
          <div>
            <button
              type="button"
              data-twe-toggle="modal"
              data-twe-target="#addModal"
              data-twe-ripple-init
              data-twe-ripple-color="light"
              className="relative overflow-hidden z-0 text-[var(--white-color)] ps-2.5 pe-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
            >
              <Icon
                icon="material-symbols:add-rounded"
                width="24"
                height="24"
              />
              Add new question
            </button>
          </div>
        </div>
        <div className="mt-8">
          <div className="flex justify-end gap-5 items-center mb-10">
            <ul
              className="flex list-none flex-row flex-wrap border-b-0 bg-[#EDF5FD] rounded-full p-1.5 gap-2 justify-end w-fit ms-auto "
              id="tabs-tab3"
              role="tablist"
              data-twe-nav-ref
            >
              <li role="presentation">
                <a
                  href="#tabs-home3"
                  className="block border-x-0 border-b-2 border-t-0 rounded-full border-transparent px-4 py-2.5 text-base font-semibold uppercase leading-tight text-[var(--secondary-color)] hover:isolate hover:border-transparent hover:bg-white focus:isolate focus:border-transparent data-[twe-nav-active]:bg-white"
                  id="tabs-home-tab3"
                  data-twe-toggle="pill"
                  data-twe-target="#tabs-home3"
                  data-twe-nav-active
                  role="tab"
                  aria-controls="tabs-home3"
                  aria-selected="true"
                >
                  People potential
                </a>
              </li>
              <li role="presentation">
                <a
                  href="#tabs-profile3"
                  className="block border-x-0 border-b-2 border-t-0 rounded-full border-transparent px-4 py-2.5 text-base font-semibold uppercase leading-tight text-[var(--secondary-color)] hover:isolate hover:border-transparent hover:bg-white focus:isolate focus:border-transparent data-[twe-nav-active]:bg-white"
                  id="tabs-profile-tab3"
                  data-twe-toggle="pill"
                  data-twe-target="#tabs-profile3"
                  role="tab"
                  aria-controls="tabs-profile3"
                  aria-selected="false"
                >
                  Operational Steadiness
                </a>
              </li>
              <li role="presentation">
                <a
                  href="#tabs-messages3"
                  className="block border-x-0 border-b-2 border-t-0 rounded-full border-transparent px-4 py-2.5 text-base font-semibold uppercase leading-tight text-[var(--secondary-color)] hover:isolate hover:border-transparent hover:bg-white focus:isolate focus:border-transparent data-[twe-nav-active]:bg-white"
                  id="tabs-messages-tab3"
                  data-twe-toggle="pill"
                  data-twe-target="#tabs-messages3"
                  role="tab"
                  aria-controls="tabs-messages3"
                  aria-selected="false"
                >
                  Digital Fluency
                </a>
              </li>
            </ul>
            <button
              type="button"
              className="flex items-center px-2.5 py-1.5 gap-1 text-[var(--primary-color)] border border-[var(--primary-color)] rounded font-medium uppercase"
            >
              <Icon icon="hugeicons:filter" width="18" height="18" />
              Filter
            </button>
          </div>
          <div>
            <div
              className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[twe-tab-active]:block"
              id="tabs-home3"
              role="tabpanel"
              data-twe-tab-active
              aria-labelledby="tabs-home-tab3"
            >
              <div id="peoplePotAccordion">
                <div className="rounded-xl border mb-5 border-neutral-200 bg-white">
                  <h2 className="mb-0" id="headingOne">
                    <button
                      className="group relative flex w-full items-center rounded-xl border-0 px-5 py-4 text-left text-lg text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none font-bold [&:not([data-twe-collapse-collapsed])]:bg-white [&:not([data-twe-collapse-collapsed])]:text-neutral-800"
                      type="button"
                      data-twe-collapse-init
                      data-twe-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      Psychological Safety
                      <span className="ms-auto h-6 w-6 shrink-0 rotate-[-180deg] transition-transform duration-200 ease-in-out group-data-[twe-collapse-collapsed]:text-[var(--primary-color)] group-data-[twe-collapse-collapsed]:from-[var(--light-primary-color)] group-data-[twe-collapse-collapsed]:to-[var(--light-primary-color)] group-data-[twe-collapse-collapsed]:rotate-0 motion-reduce:transition-none flex items-center justify-center rounded-full text-white  bg-gradient-to-t from-[#1a3652] to-[#448bd2]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                          stroke="currentColor"
                          className="size-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </span>
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="!visible"
                    data-twe-collapse-item
                    data-twe-collapse-show
                    aria-labelledby="headingOne"
                    data-twe-parent="#peoplePotAccordion"
                  >
                    <div className="pb-4">
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="safety-questions">
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="flex flex-col"
                            >
                              {questions.map((q, index) => (
                                <Draggable
                                  key={q.id}
                                  draggableId={q.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={`flex items-center justify-between py-3 px-7 gap-5 border-b border-neutral-100 last:border-0 hover:bg-slate-50 transition-colors group ${snapshot.isDragging ? "bg-white shadow-lg z-50 ring-1 ring-blue-200 rounded-lg" : ""}`}
                                    >
                                      <div className="flex items-start gap-3">
                                        <span className="font-bold text-neutral-800 min-w-[30px]">
                                          Q{index + 1}.
                                        </span>
                                        <p className="text-neutral-700">
                                          {q.text}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                          onClick={() => openEditModal(q)}
                                          className="text-blue-400 hover:text-blue-600"
                                        >
                                          <Icon
                                            icon="lucide:pencil"
                                            width="16"
                                          />
                                        </button>
                                        <button
                                          onClick={() => openDeleteModal(q)}
                                          className="text-red-400 hover:text-red-600"
                                        >
                                          <Icon
                                            icon="lucide:trash-2"
                                            width="16"
                                          />
                                        </button>
                                        <div
                                          {...provided.dragHandleProps}
                                          className="text-neutral-400 cursor-grab active:cursor-grabbing"
                                        >
                                          <Icon icon="lucide:menu" width="16" />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border mb-5 border-neutral-200 bg-white">
                  <h2 className="mb-0" id="headingTwo">
                    <button
                      className="group relative flex w-full items-center rounded-xl border-0 px-5 py-4 text-left text-lg text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none font-bold [&:not([data-twe-collapse-collapsed])]:bg-white [&:not([data-twe-collapse-collapsed])]:text-neutral-800"
                      type="button"
                      data-twe-collapse-init
                      data-twe-target="#collapseTwo"
                      data-twe-collapse-collapsed
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      Trust & Communication
                      <span className="ms-auto h-6 w-6 shrink-0 rotate-[-180deg] transition-transform duration-200 ease-in-out group-data-[twe-collapse-collapsed]:text-[var(--primary-color)] group-data-[twe-collapse-collapsed]:from-[var(--light-primary-color)] group-data-[twe-collapse-collapsed]:to-[var(--light-primary-color)] group-data-[twe-collapse-collapsed]:rotate-0 motion-reduce:transition-none flex items-center justify-center rounded-full text-white  bg-gradient-to-t from-[#1a3652] to-[#448bd2]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                          stroke="currentColor"
                          className="size-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </span>
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="!visible hidden"
                    data-twe-collapse-item
                    // data-twe-collapse-show
                    aria-labelledby="headingTwo"
                    data-twe-parent="#peoplePotAccordion"
                  >
                    <div className="px-5 pb-4">
                      <strong>This is the first item's accordion body.</strong>{" "}
                      It is shown by default, until the collapse plugin adds the
                      appropriate classes that we use to style each element.
                      These classes control the overall appearance, as well as
                      the showing and hiding via CSS transitions. You can modify
                      any of this with custom CSS or overriding our default
                      variables. It's also worth noting that just about any HTML
                      can go within the <code>.accordion-body</code>, though the
                      transition does limit overflow.
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border mb-5 border-neutral-200 bg-white">
                  <h2 className="mb-0" id="headingThree">
                    <button
                      className="group relative flex w-full items-center rounded-xl border-0 px-5 py-4 text-left text-lg text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none font-bold [&:not([data-twe-collapse-collapsed])]:bg-white [&:not([data-twe-collapse-collapsed])]:text-neutral-800"
                      type="button"
                      data-twe-collapse-init
                      data-twe-target="#collapseThree"
                      data-twe-collapse-collapsed
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                      Learning Agility
                      <span className="ms-auto h-6 w-6 shrink-0 rotate-[-180deg] transition-transform duration-200 ease-in-out group-data-[twe-collapse-collapsed]:text-[var(--primary-color)] group-data-[twe-collapse-collapsed]:from-[var(--light-primary-color)] group-data-[twe-collapse-collapsed]:to-[var(--light-primary-color)] group-data-[twe-collapse-collapsed]:rotate-0 motion-reduce:transition-none flex items-center justify-center rounded-full text-white  bg-gradient-to-t from-[#1a3652] to-[#448bd2]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                          stroke="currentColor"
                          className="size-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </span>
                    </button>
                  </h2>
                  <div
                    id="collapseThree"
                    className="!visible hidden"
                    data-twe-collapse-item
                    // data-twe-collapse-show
                    aria-labelledby="headingThree"
                    data-twe-parent="#peoplePotAccordion"
                  >
                    <div className="px-5 pb-4">
                      <strong>This is the first item's accordion body.</strong>{" "}
                      It is shown by default, until the collapse plugin adds the
                      appropriate classes that we use to style each element.
                      These classes control the overall appearance, as well as
                      the showing and hiding via CSS transitions. You can modify
                      any of this with custom CSS or overriding our default
                      variables. It's also worth noting that just about any HTML
                      can go within the <code>.accordion-body</code>, though the
                      transition does limit overflow.
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border mb-5 border-neutral-200 bg-white">
                  <h2 className="mb-0" id="headingFour">
                    <button
                      className="group relative flex w-full items-center rounded-xl border-0 px-5 py-4 text-left text-lg text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none font-bold [&:not([data-twe-collapse-collapsed])]:bg-white [&:not([data-twe-collapse-collapsed])]:text-neutral-800"
                      type="button"
                      data-twe-collapse-init
                      data-twe-target="#collapseFour"
                      data-twe-collapse-collapsed
                      aria-expanded="false"
                      aria-controls="collapseFour"
                    >
                      Leadership Support
                      <span className="ms-auto h-6 w-6 shrink-0 rotate-[-180deg] transition-transform duration-200 ease-in-out group-data-[twe-collapse-collapsed]:text-[var(--primary-color)] group-data-[twe-collapse-collapsed]:from-[var(--light-primary-color)] group-data-[twe-collapse-collapsed]:to-[var(--light-primary-color)] group-data-[twe-collapse-collapsed]:rotate-0 motion-reduce:transition-none flex items-center justify-center rounded-full text-white  bg-gradient-to-t from-[#1a3652] to-[#448bd2]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                          stroke="currentColor"
                          className="size-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </span>
                    </button>
                  </h2>
                  <div
                    id="collapseFour"
                    className="!visible hidden"
                    data-twe-collapse-item
                    // data-twe-collapse-show
                    aria-labelledby="headingFour"
                    data-twe-parent="#peoplePotAccordion"
                  >
                    <div className="px-5 pb-4">
                      <strong>This is the first item's accordion body.</strong>{" "}
                      It is shown by default, until the collapse plugin adds the
                      appropriate classes that we use to style each element.
                      These classes control the overall appearance, as well as
                      the showing and hiding via CSS transitions. You can modify
                      any of this with custom CSS or overriding our default
                      variables. It's also worth noting that just about any HTML
                      can go within the <code>.accordion-body</code>, though the
                      transition does limit overflow.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[twe-tab-active]:block"
              id="tabs-profile3"
              role="tabpanel"
              aria-labelledby="tabs-profile-tab3"
            >
              Content Operational Steadiness
            </div>
            <div
              className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[twe-tab-active]:block"
              id="tabs-messages3"
              role="tabpanel"
              aria-labelledby="tabs-profile-tab3"
            >
              Content Digital Fluency
            </div>
          </div>
        </div>
      </div>
      {/* Delete Modal */}
      <div
        data-twe-modal-init
        className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id="deleteModal"
        tabIndex={-1}
        aria-labelledby="deleteModalTitle"
        aria-modal="true"
        role="dialog"
        data-twe-backdrop="static"
      >
        <div
          data-twe-modal-dialog-ref
          className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-xl mx-auto"
        >
          <div className="mx-3 pointer-events-auto relative flex max-w-xl w-full flex-col rounded-2xl border-none bg-white bg-clip-padding text-current shadow-4 outline-none">
            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 sm:pb-0 pb-2">
              <h5
                className="sm:text-xl text-lg text-[var(--secondary-color)] invisible font-bold"
                id="deleteModalTitle"
              >
                Delete
              </h5>
              <button
                type="button"
                data-twe-modal-dismiss
                className="text-neutral-500 hover:text-neutral-800"
              >
                <Icon icon="material-symbols:close" width="24" />
              </button>
            </div>

            <div className="relative sm:py-8 py-4 px-4 grid place-items-center gap-4">
              <img src={ProgressIcon} alt="Progress Icon" width={80} />
              <div className="text-center">
                <h5 className="sm:text-xl text-lg text-[var(--secondary-color)] font-bold">
                  Are you sure to delete the question?
                </h5>
                <p className="text-sm text-neutral-600">
                  This action is permanent and the data cannot be retrieved.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-neutral-200 py-4 px-4">
              <button
                type="button"
                data-twe-modal-dismiss
                className="group text-[var(--primary-color)] px-5 py-2 h-10 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase relative overflow-hidden z-0 duration-200 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/10 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              >
                Cancel
              </button>
              <button
                type="button"
                // onClick={confirmDelete}
                // disabled={isLoading}
                className="group relative overflow-hidden z-0 bg-red-500 px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase text-white duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-white/15 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              >
                Delete
                {/* {isLoading ? "Deleting..." : "Delete"} */}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Question Modal */}
      <div
        data-twe-modal-init
        className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id="addModal"
        tabIndex={-1}
        aria-labelledby="addModalTitle"
        aria-modal="true"
        role="dialog"
        data-twe-backdrop="static"
      >
        <div
          data-twe-modal-dialog-ref
          className="pointer-events-none relative flex min-h-full w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-3xl mx-auto"
        >
          <div className="mx-3 pointer-events-auto relative flex max-w-3xl w-full flex-col rounded-2xl border-none bg-white bg-clip-padding text-current shadow-4 outline-none">
            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 sm:pb-0 pb-2">
              <h5
                className="sm:text-xl text-lg text-[var(--secondary-color)] font-bold"
                id="addModalTitle"
              >
                Create New Question
              </h5>
              <button
                type="button"
                data-twe-modal-dismiss
                className="text-neutral-500 hover:text-neutral-800"
              >
                <Icon icon="material-symbols:close" width="24" />
              </button>
            </div>

            <div className="relative sm:py-8 py-4 px-4 max-h-[calc(100vh-200px)] overflow-auto">
              <form>
                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="addRole"
                    className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
                  >
                    Role
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 right-0 top-2 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-[#5D5D5D]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    <select
                      id="addRole"
                      className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all
                        border-[#E8E8E8] focus:border-[var(--primary-color)]"
                    >
                      <option value="">Select role</option>
                      <option value="hr">HR</option>
                      <option value="engineering">Engineering</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>
                </div>

                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="addDomain"
                    className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
                  >
                    Domain
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 right-0 top-2 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-[#5D5D5D]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    <select
                      id="addDomain"
                      className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all
                        border-[#E8E8E8] focus:border-[var(--primary-color)]"
                    >
                      <option value="">Select domain</option>
                      <option value="hr">HR</option>
                      <option value="engineering">Engineering</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>
                </div>

                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="addSubDomain"
                    className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
                  >
                    Sub Domain
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 right-0 top-2 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-[#5D5D5D]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    <select
                      id="addSubDomain"
                      className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all
                        border-[#E8E8E8] focus:border-[var(--primary-color)]"
                    >
                      <option value="">Select sub-domain</option>
                      <option value="hr">HR</option>
                      <option value="engineering">Engineering</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>
                </div>

                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="addType"
                    className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
                  >
                    Type
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 right-0 top-2 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-[#5D5D5D]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    <select
                      id="addType"
                      className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all
                        border-[#E8E8E8] focus:border-[var(--primary-color)]"
                    >
                      <option value="">Select question type</option>
                      <option value="hr">HR</option>
                      <option value="engineering">Engineering</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>
                </div>

                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="addCode"
                    className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                  >
                    Code
                  </label>
                  <input
                    type="text"
                    id="addCode"
                    placeholder="Enter code"
                    className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all
                        border-[#E8E8E8] focus:border-[var(--primary-color)]"
                  />
                </div>

                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="addQuestion"
                    className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                  >
                    Question
                  </label>
                  <input
                    type="text"
                    id="addQuestion"
                    placeholder="Enter question"
                    className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all
                        border-[#E8E8E8] focus:border-[var(--primary-color)]"
                  />
                </div>

                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="addScale"
                    className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
                  >
                    Scale
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 right-0 top-2 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-[#5D5D5D]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    <select
                      id="addScale"
                      className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all
                        border-[#E8E8E8] focus:border-[var(--primary-color)]"
                    >
                      <option value="">Select scale</option>
                      <option value="hr">HR</option>
                      <option value="engineering">Engineering</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>
                </div>

                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="addPrompt"
                    className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                  >
                    Insight Prompt
                  </label>
                  <input
                    type="text"
                    id="addPrompt"
                    placeholder="Enter insight"
                    className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all
                        border-[#E8E8E8] focus:border-[var(--primary-color)]"
                  />
                </div>

                <button
                  className="text-[var(--primary-color)] font-bold flex items-center gap-2 mt-5"
                  type="button"
                >
                  <Icon icon="fluent:add-24-filled" width="18" height="18" />
                  Add More Question
                </button>
              </form>
            </div>
            {/* </div> */}

            <div className="flex items-center justify-end gap-3 border-t border-neutral-200 py-4 px-4">
              <button
                type="button"
                data-twe-modal-dismiss
                className="group text-[var(--primary-color)] px-5 py-2 h-10 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase relative overflow-hidden z-0 duration-200 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/10 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              >
                Cancel
              </button>
              <button
                type="button"
                // onClick={confirmDelete}
                // disabled={isLoading}
                className="group relative overflow-hidden z-0 text-[var(--white-color)] px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              >
                Create
                {/* {isLoading ? "Deleting..." : "Delete"} */}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Question Modal */}
      <div
        data-twe-modal-init
        className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id="editModal"
        tabIndex={-1}
        aria-labelledby="editModalTitle"
        aria-modal="true"
        role="dialog"
        data-twe-backdrop="static"
      >
        <div
          data-twe-modal-dialog-ref
          className="pointer-events-none relative flex min-h-full w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-3xl mx-auto"
        >
          <div className="mx-3 pointer-events-auto relative flex max-w-3xl w-full flex-col rounded-2xl border-none bg-white bg-clip-padding text-current shadow-4 outline-none">
            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 sm:pb-0 pb-2">
              <h5
                className="sm:text-xl text-lg text-[var(--secondary-color)] font-bold"
                id="editModalTitle"
              >
                Edit Question
              </h5>
              <button
                type="button"
                data-twe-modal-dismiss
                className="text-neutral-500 hover:text-neutral-800"
              >
                <Icon icon="material-symbols:close" width="24" />
              </button>
            </div>

            <div className="relative sm:py-8 py-4 px-4 max-h-[calc(100vh-200px)] overflow-auto">
              <form>
                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="addRole"
                    className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
                  >
                    Role
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 right-0 top-2 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-[#5D5D5D]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    <select
                      id="addRole"
                      className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all
                        border-[#E8E8E8] focus:border-[var(--primary-color)]"
                    >
                      <option value="">Select role</option>
                      <option value="hr">HR</option>
                      <option value="engineering">Engineering</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>
                </div>

                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="addDomain"
                    className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
                  >
                    Domain
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 right-0 top-2 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-[#5D5D5D]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    <select
                      id="addDomain"
                      className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all
                        border-[#E8E8E8] focus:border-[var(--primary-color)]"
                    >
                      <option value="">Select domain</option>
                      <option value="hr">HR</option>
                      <option value="engineering">Engineering</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>
                </div>

                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="addSubDomain"
                    className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
                  >
                    Sub Domain
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 right-0 top-2 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-[#5D5D5D]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    <select
                      id="addSubDomain"
                      className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all
                        border-[#E8E8E8] focus:border-[var(--primary-color)]"
                    >
                      <option value="">Select sub-domain</option>
                      <option value="hr">HR</option>
                      <option value="engineering">Engineering</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>
                </div>

                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="addType"
                    className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
                  >
                    Type
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 right-0 top-2 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-[#5D5D5D]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    <select
                      id="addType"
                      className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all
                        border-[#E8E8E8] focus:border-[var(--primary-color)]"
                    >
                      <option value="">Select question type</option>
                      <option value="hr">HR</option>
                      <option value="engineering">Engineering</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>
                </div>

                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="addCode"
                    className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                  >
                    Code
                  </label>
                  <input
                    type="text"
                    id="addCode"
                    placeholder="Enter code"
                    className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all
                        border-[#E8E8E8] focus:border-[var(--primary-color)]"
                  />
                </div>

                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="addQuestion"
                    className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                  >
                    Question
                  </label>
                  <input
                    type="text"
                    id="addQuestion"
                    placeholder="Enter question"
                    className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all
                        border-[#E8E8E8] focus:border-[var(--primary-color)]"
                  />
                </div>

                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="addScale"
                    className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
                  >
                    Scale
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 right-0 top-2 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-[#5D5D5D]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    <select
                      id="addScale"
                      className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all
                        border-[#E8E8E8] focus:border-[var(--primary-color)]"
                    >
                      <option value="">Select scale</option>
                      <option value="hr">HR</option>
                      <option value="engineering">Engineering</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="addPrompt"
                    className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                  >
                    Insight Prompt
                  </label>
                  <input
                    type="text"
                    id="addPrompt"
                    placeholder="Enter insight"
                    className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all
                        border-[#E8E8E8] focus:border-[var(--primary-color)]"
                  />
                </div>
              </form>
            </div>
            {/* </div> */}

            <div className="flex items-center justify-end gap-3 border-t border-neutral-200 py-4 px-4">
              <button
                type="button"
                data-twe-modal-dismiss
                className="group text-[var(--primary-color)] px-5 py-2 h-10 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase relative overflow-hidden z-0 duration-200 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/10 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              >
                Cancel
              </button>
              <button
                type="button"
                // onClick={confirmDelete}
                // disabled={isLoading}
                className="group relative overflow-hidden z-0 text-[var(--white-color)] px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              >
                Update
                {/* {isLoading ? "Deleting..." : "Delete"} */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudQuestion;

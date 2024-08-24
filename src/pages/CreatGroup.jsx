import React, { useState, createRef, useEffect } from "react";
import { TiGroup } from "react-icons/ti";
// ================== firebase import ===============
import { getDatabase, set, ref, push, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref as storageMainRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
// ================== firebase import ===============
import { ToastContainer, toast, Bounce } from "react-toastify";
import moment from "moment";
// ================ react modal ================
import Modal from "react-modal";
import { IoMdCloseCircleOutline } from "react-icons/io";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    border: "none",
    padding: "0px",
    boxShadow: "rgb(0, 0, 0,0.3) 0 0 100px 5px",
    borderRadius: "0",
  },
};

const ModalGroup = () => {
  // =============== all states ====================
  const db = getDatabase();
  const auth = getAuth();
  const storage = getStorage();
  //   const storage = getStorage();
  // ============= input  state ==============
  const [allInput, setallInput] = useState({
    groupTagName: "",
    groupName: "",
    GroupPhoto: "",
  });
  // ========== input error state ============
  const [allInputError, setallInputError] = useState({
    GroupTagNameErr: "",
    GroupNameErr: "",
  });

  // ============== set Loading state ===============
  const [loading, setloading] = useState(false);

  // ============= modal state ================
  const [modalIsOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
    setallInputError({
      ...allInputError,
      GroupNameErr: "",
      GroupTagNameErr: "",
    });
  }
  function openModal() {
    setIsOpen(true);
  }

  // ============== handle submit function ================
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  // ============= handle input function ========
  const handleInput = (e) => {
    setallInput({
      ...allInput,
      [e.target.id]: e.target.value,
    });
  };

  // =================== HandleImage function ==================
  const [GroupPhoto, setGroupPhoto] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [progress, setprogress] = useState(0);
  const HandleImage = (e) => {
    const { files } = e.target;
    setGroupPhoto(files[0]);
    // Create a preview URL for the selected image
    const previewUrl = URL.createObjectURL(files[0]);
    setImagePreview(previewUrl);

    // Clean up the object URL when the component unmounts
    return () => URL.revokeObjectURL(previewUrl);
  };

  // ============ Handle Create Group ==================
  const handleCreatGroup = () => {
    if (!allInput.groupName) {
      setallInputError({
        ...allInputError,
        GroupNameErr: "please insert a name",
        GroupTagNameErr: "",
      });
    } else if (!allInput.groupTagName) {
      setallInputError({
        ...allInputError,
        GroupNameErr: "",
        GroupTagNameErr: "please insert a tag name",
      });
    } else if (!GroupPhoto) {
      setallInputError({
        ...allInputError,
        GroupNameErr: "",
        GroupTagNameErr: "",
      });
      toast.error("please crop an image", {
        position: "top-center",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else {
      setloading(true);
      setallInputError({
        ...allInputError,
        GroupNameErr: "",
        GroupTagNameErr: "",
      });

      // ==================== image upload in firebase storage ======================
      // Upload file and metadata to the object 'images/mountains.jpg'
      const storageRef = storageMainRef(
        storage,
        "Group-Image/" + GroupPhoto.name,
      );
      const uploadTask = uploadBytesResumable(storageRef, GroupPhoto);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setprogress(progress);
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error.code);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            // ================ data upload in database ================
            set(push(ref(db, "grouplist/")), {
              GroupName: allInput.groupName,
              GroupTagName: allInput.groupTagName,
              GroupPhotoUrl: downloadURL,
              AdminUid: auth.currentUser.uid,
              AdminUserName: auth.currentUser.displayName,
              AdminEmail: auth.currentUser.email,
              AdminProfilePic: auth.currentUser.photoURL,
              createdDate: moment().format("MM//DD/YYYY, h:mm:ss a"),
            })
              .then(() => {
                console.log("group created successfully");
              })
              .catch((err) => {
                alert(err);
              })
              .finally(() => {
                setloading(false);
                setprogress(0);
                closeModal();
                setImagePreview("");
              });
          });
        },
      );
    }
  };

  return (
    <>
      <div className="flex h-[100vh] w-full items-center justify-center bg-[#a7e87641]">
        <button
          onClick={openModal}
          type="button"
          class="relative  inline-flex items-center rounded-lg bg-btnColor px-5 py-2.5 text-center text-[17px] font-medium text-white  "
        >
          <TiGroup className="me-[7px] text-[24px]" />
          Creat Group
        </button>
        {/* ================ modal body ========== */}
        <Modal
          isOpen={modalIsOpen}
          style={customStyles}
          contentLabel="Example Modal"
        >
          {/* ======================================================== */}
          <div className="relative mb-10 w-full bg-gradient-to-r from-[#2a66f2] to-[#1ebcf1]">
            <button
              onClick={closeModal}
              className="absolute right-0 top-8 mb-2 flex h-[50px] w-[60px] items-center justify-center  bg-[#7a73738a] text-[35px] text-[#000000d2] "
            >
              <IoMdCloseCircleOutline />
            </button>
            <div className="pb-14 ps-14 pt-11">
              <h2 className=" font-open text-[45px] font-thin text-[#e4ffe0] ">
                Creat Group
              </h2>
              <p className="ps-[110px] font-popin text-[16px] font-thin leading-[5px] text-[rgba(228,255,224,0.8)]">
                In a few easy steps
              </p>
            </div>
          </div>
          {/* ======================================================== */}
          <form onSubmit={handleSubmit}>
            {/* ========================================= */}
            <div className="mb-10 flex w-full">
              {/* ================================ */}
              <div className="w-1/2  px-5">
                <div className="h-[260px]">
                  {/* =========== group name input =============== */}

                  <div className="relative h-1/2">
                    <label
                      htmlFor="email"
                      className="mb-2 flex text-[20px] font-semibold capitalize italic text-darkBlue "
                    >
                      Group name
                    </label>
                    <input
                      type="text"
                      placeholder="Group Name"
                      id="groupName"
                      name="groupName"
                      autoComplete="off"
                      className=" text-bl w-full rounded-lg bg-[rgba(30,188,241,0.15)]  px-[20px] py-[15px] text-[15px] focus:outline-none"
                      onChange={handleInput}
                    />
                    {allInputError.GroupNameErr && (
                      <span
                        className="absolute bottom-[10px] left-0 ms-2 mt-2 inline-block font-normal text-[red] "
                        id="GroupNameErr"
                      >
                        {allInputError.GroupNameErr}
                      </span>
                    )}
                  </div>
                  {/* =========== group tag name input =============== */}

                  <div className="relative h-1/2">
                    <label
                      htmlFor="email"
                      className="mb-2 flex text-[20px] font-semibold capitalize italic text-darkBlue "
                    >
                      Group Tagname
                    </label>
                    <input
                      type="text"
                      placeholder="Group TagName"
                      id="groupTagName"
                      name="groupTagName"
                      autoComplete="off"
                      className=" w-full rounded-lg bg-[rgba(30,188,241,0.15)] px-[20px] py-[15px] text-[15px] focus:outline-none"
                      onChange={handleInput}
                    />
                    {allInputError.GroupTagNameErr && (
                      <span
                        className="absolute bottom-[10px] left-0 ms-2 mt-2 inline-block font-normal text-[red] "
                        id="GroupTagNameErr"
                      >
                        {allInputError.GroupTagNameErr}
                      </span>
                    )}
                  </div>
                </div>
                {/* =========== submit button =============== */}
                <button
                  type="submit"
                  className="relative w-full rounded-lg bg-btnColor py-4 text-center font-nunito text-[20px] text-base font-semibold capitalize text-white"
                  onClick={handleCreatGroup}
                >
                  Creat group
                  {loading && (
                    <div className="bg-transparent absolute  left-[28%] top-[33%] h-5 w-5 animate-spin rounded-full border-[3.5px] border-b-gray border-l-white border-r-gray border-t-white"></div>
                  )}
                </button>
              </div>
              {/* ===================================== */}
              <div className="w-1/2 pe-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 flex text-[20px] font-semibold capitalize italic text-darkBlue "
                  >
                    Upload a photo
                  </label>
                  <input
                    className="w-full cursor-pointer text-sm focus:outline-none"
                    type="file"
                    onChange={HandleImage}
                  />
                </div>
                <div className="mt-5 h-[235px] w-full bg-darkBlue">
                  <picture>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Selected Preview"
                        className="h-[100%] w-full object-cover"
                      />
                    )}
                  </picture>
                </div>
              </div>
            </div>
          </form>
          {progress > 0 && (
            <div className="mb-14 w-full px-10">
              <div class="relative mt-8 h-2.5 w-full rounded-full bg-[#0000003a] ">
                <div
                  class="h-2.5  rounded-full bg-btnColor "
                  style={{ width: `${progress}%` }}
                ></div>
                <p className="absolute left-1/2 top-[-30px] -translate-x-1/2">
                  {Math.ceil(progress)} %
                </p>
              </div>
            </div>
          )}
        </Modal>
        {/* ================ modal body ========== */}
        <div>
          <ToastContainer
            position="top-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </div>
    </>
  );
};

export default ModalGroup;

import React, { useState, useEffect } from "react";
import { db, auth } from "../database/firebase";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { FloatingLabel, Form, FormControl } from "react-bootstrap";
import { ref, onValue, update } from "firebase/database";
import Login from "../auth/Login";

function Category() {
  const [dataTabel, setDataTabel] = useState("");
  const [modalShow2, setModalShow2] = React.useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [isError, setisError] = useState(false);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [petunjuk, setPetunjuk] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [pilih_category, setPilih_category] = useState("");
  const [tempUuid, setTempUuid] = useState("");

  // ** Read
  useEffect(() => {
    onValue(ref(db, `/categories`), (snapshot) => {
      let timerInterval;
      Swal.fire({
        title: "Memuat data !",
        html: "I will close in <b></b> milliseconds.",
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const b = Swal.getHtmlContainer().querySelector("b");
          timerInterval = setInterval(() => {
            b.textContent = Swal.getTimerLeft();
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log("I was closed by the timer");
        }
      });
      setisLoading(false);
      setDataTabel([]);
      const data = snapshot.val();
      if (data !== null) {
        Object.values(data).map((item) => {
          setDataTabel((oldArray) => [...oldArray, item]);
        });
      } else {
        setisError(true);
      }
    });
    console.log("Data has been Read to database");
  }, []);

  //** Update
  const handleUpdate = (item) => {
    console.log("Update Button", item.uuid, item.petunjuk);
    setModalShow2(true, item.uuid);
    setCategory(item.category);
    setDescription(item.description);
    setLink(item.link);
    setPetunjuk(item.petunjuk);
    setThumbnail(item.thumbnail);
    setPilih_category(item.pilih_category);
    setTempUuid(item.uuid);
  };

  //** Login Session User */
  const [user, setUser] = useState(null);

  // fungsi untuk logout
  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log("Logout berhasil");
        // redirect ke halaman login
      })
      .catch((error) => {
        console.log("Logout gagal: ", error);
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Login berhasil!");
        setUser(user);
        // Redirect ke halaman setelah login berhasil
      } else {
        console.log("Belum login");
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  //**  Render komponen Login jika user belum login
  if (!user) {
    return <Login />;
  }
  if (isLoading)
    return (
      <div className="text-center mt-5">
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  else if (dataTabel && !isError)
    return (
      <>
        {user ? (
          <div>
            <div className="container xl:px-52 lg:px-32 md:px-5 xs:px-5 mt-5">
              <nav
                className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 mt-3"
                aria-label="Breadcrumb"
              >
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                    <a
                      href="/admin/dashboard-admin"
                      className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 "
                    >
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <a
                        href="/admin/category-game"
                        className="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2 "
                      >
                        Category
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <a
                        href="/admin/category-game"
                        className="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2 "
                      >
                        Game
                      </a>
                    </div>
                  </li>
                </ol>
              </nav>
              <div className="text-3xl font-bold mb-4 mt-10">Category</div>
              {/* <div>
                            <button className=" rounded-full"><PlusCircleIcon className="w-8 hover:text-indigo-500 " onClick={() => setModalShow(true)} /></button>
                            <TambahData
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                            />
                        </div> */}
              <div>
                <div className="overflow-x-auto rounded-lg">
                  <table className="table-auto border-collapse">
                    <thead className="bg-gray-50">
                      <tr className="bg-gray-200 text-gray-700">
                        <th className="py-2 px-4 border">No</th>
                        <th className="py-2 px-4 border">Nama Kategori</th>
                        <th className="py-2 px-4 border">Deskripsi</th>
                        <th className="py-2 px-4 border">Gambar Kategori</th>
                        <th className="py-2 px-4 border">Gambar Petunjuk</th>
                        <th className="py-2 px-4 border">URL</th>
                        <th className="py-2 px-4 border">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dataTabel.map((item, index) => {
                        return (
                          <>
                            <tr key={item}>
                              <td className="px-6 py-4 whitespace-nowrap border">
                                <div className="text-sm font-medium text-gray-900">
                                  {index + 1}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap border">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.category}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap border">
                                <div className="text-sm text-gray-500">
                                  {item.description}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap border">
                                <div className="text-sm px-3 text-gray-500">
                                  <img
                                    className="w-8"
                                    src={item.thumbnail}
                                    alt={item.category}
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap border">
                                <div className="text-sm px-3 text-gray-500">
                                  <img
                                    className="w-8"
                                    src={item.petunjuk}
                                    alt={item.category}
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap border">
                                <div className="text-sm font-medium text-gray-900">
                                  https://example.nelify.app{item.link}
                                </div>
                              </td>
                              <td className="flex px-6 py-4 whitespace-nowrap border">
                                <div>
                                  <button
                                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => handleUpdate(item)}
                                  >
                                    Edit
                                  </button>
                                  <EditData
                                    show={modalShow2}
                                    onHide={() => setModalShow2(false)}
                                    category={category}
                                    description={description}
                                    link={link}
                                    petunjuk={petunjuk}
                                    thumbnail={thumbnail}
                                    pilih_category={pilih_category}
                                    uuid={tempUuid}
                                  />
                                </div>
                                {/* <div>
                                                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => handleDelete(item)}>
                                                                    Delete
                                                                </button>
                                                            </div> */}
                              </td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Login />
        )}
      </>
    );
  else {
    return (
      <>
        <div>
          <div className="container xl:px-52 lg:px-32 md:px-5 xs:px-5 mt-5">
            <nav
              className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 mt-3"
              aria-label="Breadcrumb"
            >
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <a
                    href="/admin/Dashboard-Admin"
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 "
                  >
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    Dashboard
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <a
                      href="/admin/mobile-legends"
                      className="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2 "
                    >
                      Mobile Legends
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
            <div className="text-3xl font-bold mb-4 mt-10">Category</div>
            {/* <div>
                            <button className=" rounded-full"><PlusCircleIcon className="w-8 hover:text-indigo-500 " onClick={() => setModalShow(true)} /></button>
                            <TambahData
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                            />
                        </div> */}
            <div>
              <div className="overflow-x-scroll rounded-lg">
                <table className="table-auto border-collapse">
                  <thead className="bg-gray-50">
                    <tr className="bg-gray-200 text-gray-700">
                      <th className="py-2 px-4 border">No</th>
                      <th className="py-2 px-4 border">Nama Kategori</th>
                      <th className="py-2 px-4 border">Deskripsi</th>
                      <th className="py-2 px-4 border">Gambar Kategori</th>
                      <th className="py-2 px-4 border">Gambar Petunjuk</th>
                      <th className="py-2 px-4 border">URL</th>
                      <th className="py-2 px-4 border">Actions</th>
                    </tr>
                  </thead>
                </table>
                <tbody className="bg-white divide-y divide-gray-200">
                  <div divclassName="px-6 py-4 text-center whitespace-nowrap border text-sm font-medium text-gray-900">
                    Tidak Ada Data
                  </div>
                </tbody>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

function EditData(props) {
  const [category, setCategory] = useState(props.category || "");
  const [description, setDescription] = useState(props.description || "");
  const [link, setLink] = useState(props.link || "");
  const [petunjuk, setPetunjuk] = useState(props.petunjuk || "");
  const [thumbnail, setThumbnail] = useState(props.thumbnail || "");
  const [pilih_category, setPilih_category] = useState(
    props.pilih_category || ""
  );
  const [tempUuid, setTempUuid] = useState(props.uuid || "");

  useEffect(() => {
    setCategory(props.category || "");
  }, [props.category]);

  useEffect(() => {
    setDescription(props.description || "");
  }, [props.description]);

  useEffect(() => {
    setLink(props.link || "");
  }, [props.link]);

  useEffect(() => {
    setPetunjuk(props.petunjuk || "");
  }, [props.petunjuk]);

  useEffect(() => {
    setThumbnail(props.thumbnail || "");
  }, [props.thumbnail]);

  useEffect(() => {
    setPilih_category(props.pilih_category || "");
  }, [props.pilih_category]);

  useEffect(() => {
    // Update nilai tempUuid saat props.uuid berubah
    setTempUuid(props.uuid || "");
  }, [props.uuid]);

  const handleDataChange1 = (e) => {
    setCategory(e.target.value);
  };
  const handleDataChange2 = (e) => {
    setDescription(e.target.value);
  };
  const handleDataChange3 = (e) => {
    setLink(e.target.value);
  };
  const handleDataChange4 = (e) => {
    setPetunjuk(e.target.value);
  };
  const handleDataChange5 = (e) => {
    setThumbnail(e.target.value);
  };
  const handleDataChange6 = (e) => {
    setPilih_category(e.target.value);
  };

  // ** Update
  const handleSubmitChange = (e) => {
    console.log("tempUuid :", tempUuid);
    e.preventDefault();
    if (tempUuid) {
      update(ref(db, `/categories/${tempUuid}`), {
        category,
        description,
        link,
        petunjuk,
        thumbnail,
        pilih_category,
        uuid: tempUuid,
      });
      setCategory("");
      setDescription("");
      setLink("");
      setPetunjuk("");
      setThumbnail("");
      setPilih_category("");
      window.location.reload();
      props.onHide();
    }
  };
  return (
    <>
      <Form onSubmit={handleSubmitChange}>
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Edit Data
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FloatingLabel
              controlId="floatingCategory"
              label="Category"
              className="mb-3"
            >
              <FormControl
                type="text"
                value={category}
                onChange={handleDataChange1}
                placeholder="Category"
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="floatingDescription"
              label="Description"
              className="mb-3"
            >
              <FormControl
                type="text"
                as="textarea"
                style={{ height: "100px" }}
                value={description}
                onChange={handleDataChange2}
                placeholder="Description"
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="floatingLink"
              label="URL Category"
              className="mb-3"
            >
              <FormControl
                type="url"
                value={link}
                onChange={handleDataChange3}
                placeholder="URL gambar (https://example.com/)"
                readOnly
                disabled
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="floatingPetunjuk"
              label="Petunjuk (https://example.com/)"
              className="mb-3"
            >
              <FormControl
                type="url"
                value={petunjuk}
                onChange={handleDataChange4}
                placeholder="Petunjuk"
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="floatingThumbnail"
              label="Thumbnail (https://example.com/)"
              className="mb-3"
            >
              <FormControl
                type="url"
                value={thumbnail}
                onChange={handleDataChange5}
                placeholder="Thumbnail"
              />
            </FloatingLabel>
            <Form.Select
              aria-label="Default select example"
              id="zone_id"
              name="zone_id"
              onChange={handleDataChange6}
              required
            >
              <option value={pilih_category}>-{pilih_category} -</option>
              <option value="top_up_pulsa">top_up_pulsa</option>
              <option value="top_up_game">top_up_game</option>
              <option value="OFF">OFF</option>
            </Form.Select>
          </Modal.Body>
          <Modal.Footer>
            <Button className="bg-red-500" onClick={props.onHide}>
              Close
            </Button>
            <Button
              type="submit"
              onClick={handleSubmitChange}
              className="bg-indigo-500 "
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>
    </>
  );
}

export default Category;

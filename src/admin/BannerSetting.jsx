import React, { useState, useEffect } from 'react'
import { uid } from 'uid'
import { db, auth } from '../database/firebase'
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import { FloatingLabel, Form, FormControl } from 'react-bootstrap';
import { set, ref, onValue, remove, update } from "firebase/database";
import Login from '../auth/Login';

function BannerSetting() {
    const [dataTabel, setDataTabel] = useState('');
    const [modalShow, setModalShow] = React.useState(false);
    const [modalShow2, setModalShow2] = React.useState(false);
    const [isLoading, setisLoading] = useState(true);
    const [isError, setisError] = useState(false);
    const [banner, setBanner] = useState('');
    const [tempUuid, setTempUuid] = useState('');
    // ** Read 
    useEffect(() => {
        onValue(ref(db, `/banner`), (snapshot) => {
            let timerInterval
            Swal.fire({
                title: 'Memuat data !',
                html: 'I will close in <b></b> milliseconds.',
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                    const b = Swal.getHtmlContainer().querySelector('b')
                    timerInterval = setInterval(() => {
                        b.textContent = Swal.getTimerLeft()
                    }, 100)
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            }).then((result) => {
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                    console.log('I was closed by the timer')
                }
            })
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

    // ** Delete
    const handleDelete = (item) => {
        remove(ref(db, `/banner/${item.uuid}`));
    };

    //** Update
    const handleUpdate = (item) => {
        console.log(
            'Update Button',
            'uuid :', item.uuid
        );
        setModalShow2(true, item.uuid);
        setBanner(item.banner);
        setTempUuid(item.uuid);
    };
    //** Login Session User */
    const [user, setUser] = useState(null);

    // fungsi untuk logout
    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                console.log('Logout berhasil');
                // redirect ke halaman login
            })
            .catch((error) => {
                console.log('Logout gagal: ', error);
            });
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('Login berhasil!');
                setUser(user);
                // Redirect ke halaman setelah login berhasil
            } else {
                console.log('Belum login');
                setUser(null);
            }
        });
        return unsubscribe;
    }, [])

    //**  Render komponen Login jika user belum login
    if (!user) {
        return <Login />;
    }
    if (isLoading)
        return (
            <div className="text-center mt-5">
                <div role="status">
                    <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
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
                            <nav className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 mt-3" aria-label="Breadcrumb">
                                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                    <li className="inline-flex items-center">
                                        <a href="/admin/dashboard-admin" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 ">
                                            <svg aria-hidden="true" className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                                            Dashboard
                                        </a>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <svg aria-hidden="true" className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                            <a href="/admin/banner-setting" className="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2 ">Setting</a>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <svg aria-hidden="true" className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                            <a href="/admin/banner-setting" className="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2 ">Banner</a>
                                        </div>
                                    </li>
                                </ol>
                            </nav>
                            <div className='text-3xl font-bold mb-4 mt-10'>
                                Banner
                            </div>
                            <div>
                                <button className=" rounded-full"><PlusCircleIcon className="w-8 hover:text-indigo-500 " onClick={() => setModalShow(true)} /></button>
                                <TambahData
                                    show={modalShow}
                                    onHide={() => setModalShow(false)}
                                />
                            </div>
                            <div>
                                <div className="overflow-x-auto rounded-lg">
                                    <table className="table-auto border-collapse">
                                        <thead className="bg-gray-50">
                                            <tr className="bg-gray-200 text-gray-700">
                                                <th className="py-2 px-4 border">No</th>
                                                <th className="py-2 px-4 border">Banner</th>
                                                <th className="py-2 px-4 border">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {dataTabel.map((item, index) => {
                                                return (
                                                    <>
                                                        <tr key={item.uuid}>
                                                            <td className="px-6 py-4 whitespace-nowrap border">
                                                                <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                                                            </td>
                                                            <td className="px-6 py-6 whitespace-nowrap border">
                                                                <div className="text-sm font-medium text-gray-900"><img className='w-full h-full' src={item.banner} alt="" /></div>
                                                            </td>
                                                            <td className="flex px-6 py-4 whitespace-nowrap border">
                                                                <div>
                                                                    <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleUpdate(item)} >
                                                                        Edit
                                                                    </button>
                                                                    <EditData
                                                                        show={modalShow2}
                                                                        onHide={() => setModalShow2(false)}
                                                                        banner={banner}
                                                                        uuid={tempUuid}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => handleDelete(item)}>
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </>
                                                )
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
        )
    else {
        return (
            <>
                <div>
                    <div className="container xl:px-52 lg:px-32 md:px-5 xs:px-5 mt-5">
                        <nav className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 mt-3" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                <li className="inline-flex items-center">
                                    <a href="/admin/dashboard-admin" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 ">
                                        <svg aria-hidden="true" className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                                        Dashboard
                                    </a>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <svg aria-hidden="true" className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                        <a href="/admin/banner" className="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2 ">Homepage</a>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <svg aria-hidden="true" className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                        <a href="/admin/banner" className="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2 ">Banner</a>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                        <div className='text-3xl font-bold mb-4 mt-10'>
                            Banner
                        </div>
                        <div>
                            <button className=" rounded-full"><PlusCircleIcon className="w-8 hover:text-indigo-500 " onClick={() => setModalShow(true)} /></button>
                            <TambahData
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                            />
                        </div>
                        <div>
                            <div className="overflow-x-auto rounded-lg">
                                <table className="table-auto border-collapse">
                                    <thead className="bg-gray-50">
                                        <tr className="bg-gray-200 text-gray-700">
                                            <th className="py-2 px-4 border">No</th>
                                            <th className="py-2 px-4 border">Banner</th>
                                            <th className="py-2 px-4 border">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        Tidak Ada Data
                                        {dataTabel.map((item, index) => {
                                            return (
                                                <>
                                                    <tr key={item.uuid}>
                                                        <td className="px-6 py-4 whitespace-nowrap border">
                                                            <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                                                        </td>
                                                        <td className="px-6 py-6 whitespace-nowrap border">
                                                            <div className="text-sm font-medium text-gray-900"><img className='w-full h-full' src={item.banner} alt="" /></div>
                                                        </td>
                                                        <td className="flex px-6 py-4 whitespace-nowrap border">
                                                            <div>
                                                                <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleUpdate(item)} >
                                                                    Edit
                                                                </button>
                                                                <EditData
                                                                    show={modalShow2}
                                                                    onHide={() => setModalShow2(false)}
                                                                    banner={banner}
                                                                    uuid={tempUuid}
                                                                />
                                                            </div>
                                                            <div>
                                                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => handleDelete(item)}>
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}

function TambahData(props) {
    const [banner, setBanner] = useState("");

    const handleDataChange1 = (e) => {
        setBanner(e.target.value)
    }
    // ** Write
    const handleOnSubmit = () => {
        const uuid = uid();
        set(ref(db, `/banner/${uuid}`), {
            banner,
            uuid,
        });
        setBanner("");
        props.onHide('');
        window.location.reload();
        console.log('Data Produk Mlbb Berahasil Ditambah', handleOnSubmit);
    }
    return (
        <>
            <Form onSubmit={handleOnSubmit}>
                <Modal
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Tambah Data
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FloatingLabel
                            controlId="floatingQR"
                            label="Banner"
                            className="mb-3"
                        >
                            <FormControl type="text" value={banner} onChange={handleDataChange1} placeholder='Banner' />
                        </FloatingLabel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='bg-red-500' onClick={props.onHide}>Close</Button>
                        <Button type='submit' onClick={handleOnSubmit} className='bg-indigo-500 '>Save</Button>
                    </Modal.Footer>
                </Modal>
            </Form>
        </>
    )
}
function EditData(props) {
    const [banner, setBanner] = useState(props.banner || "");
    const [tempUuid, setTempUuid] = useState(props.uuid || "");

    useEffect(() => {
        setBanner(props.banner || "");
    }, [props.banner]);

    useEffect(() => {
        // Update nilai tempUuid saat props.uuid berubah
        setTempUuid(props.uuid || "");
    }, [props.uuid]);

    const handleDataChange1 = (e) => {
        setBanner(e.target.value)
    }

    // ** Update
    const handleSubmitChange = (e) => {
        console.log("tempUuid :", tempUuid);
        e.preventDefault();
        if (tempUuid) {
            update(ref(db, `/banner/${tempUuid}`), {
                banner,
                uuid: tempUuid,
            });
            setBanner('');
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
                    animation={false}
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Edit Data
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FloatingLabel
                            controlId="floatingQRIS"
                            label="QRIS"
                            className="mb-3"
                        >
                            <FormControl type="text" value={banner} onChange={handleDataChange1} placeholder='QRIS' />
                        </FloatingLabel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='bg-red-500' onClick={props.onHide}>Close</Button>
                        <Button type='submit' onClick={handleSubmitChange} className='bg-indigo-500 '>Save</Button>
                    </Modal.Footer>
                </Modal>
            </Form>
        </>
    )
}

export default BannerSetting
import { Divider, Drawer, FloatButton } from "antd";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { googleLogout } from "@react-oauth/google";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { CloseOutlined } from "@ant-design/icons";
import AdminPortal from "../../Pages/AdminPortal/AdminPortal";
import GetHelpModal from "../GetHelpModal/GetHelpModal";
import PrivacyPolicyModal from "../PrivacyPolicyModal/PrivacyPolicyModal";
import AboutUsModal from "../AboutUsModal/AboutUsModal";
import { Axios } from "../../Config/Axios/Axios";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
const ReachableContext = createContext(null);
const UnreachableContext = createContext(null);

const ProfileDrawer = ({ profileOpen, setProfileOpen }) => {
  const [userCredentials, setuserCredentials] = useState(null);
  const [metadata, setMetadata] = useState({});
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Debug logging
  useEffect(() => {
    console.log("ProfileDrawer - User data:", user);
    console.log("ProfileDrawer - User picture:", user?.picture);
  }, [user]);

  useEffect(() => {
    // const userCred = jwtDecode(localStorage.getItem("token"));
    // setuserCredentials(userCred);

    if (!user?.userId) return;

    setLoading(true);

    Axios.get(`/api/v1/app/metadata/getProfileMetadataByUserId`, {
      params: {
        userId: user?.userId,
      },
      headers: {
        authorization: `bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        setMetadata(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setIsError(true);
        setLoading(false);
      });
  }, [user?.userId]);

  const onProfileClose = () => {
    setProfileOpen(false);
  };

  const getHelpRef = useRef();
  const privacyPolicyRef = useRef();
  const aboutUsRef = useRef();

  const handleOk = () => {
    googleLogout();
    localStorage.removeItem("token");
    window.location.reload();
  };

  const callGetHelpModal = () => {
    if (getHelpRef.current) {
      getHelpRef.current.showModal();
    }
  };

  const callPrivacyPolicyModal = () => {
    if (privacyPolicyRef.current) {
      privacyPolicyRef.current.showModal();
    }
  };

  const callAboutUsModal = () => {
    if (aboutUsRef.current) {
      aboutUsRef.current.showModal();
    }
  };

  return (
    <Drawer
      placement={"right"}
      closable={false}
      onClose={onProfileClose}
      open={profileOpen}
      style={{ padding: 0 }}
      key={"right"}
      loading={loading}
    >
      <div className="card" style={{ borderRadius: "6px" }}>
        <div className="card-body text-center">
          <div className="mt-3 mb-4">
            <img
              key={user?.picture ? `user-${user.picture}-${Date.now()}` : 'default-avatar'}
              src={
                user?.picture
                  ? user.picture
                  : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
              }
              className="rounded-circle img-fluid"
              style={{ width: "100px" }}
              alt="User"
              onLoad={() => console.log("Image loaded successfully:", user?.picture)}
              onError={(e) => {
                console.log("Image failed to load:", user?.picture);
                if (e.target.src !== "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp") {
                  e.target.src = "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp";
                }
              }}
            />
          </div>
          <h4 className="mb-2">{user?.name}</h4>
          <p className="text-muted mb-4">
            {/* 8547520864 <span className="mx-2">|</span>  */}
            {user?.email}
          </p>
          <div className="mb-4 pb-2 d-flex flex-column gap-2">
            <button
              type="button"
              className="btn btn-outline-primary btn-floating"
              onClick={() => {navigate("/admin")}}
            >
              {/* <PersonCircleIcon /> */}
              Admin Portal
            </button>
            <button
              type="button"
              className="btn btn-outline-primary btn-floating"
              onClick={callGetHelpModal}
            >
              {/* <WechatOutlined /> */}
              Get Help
            </button>
            <button
              type="button"
              className="btn btn-outline-primary btn-floating"
              onClick={callPrivacyPolicyModal}
            >
              {/* <AlertFillIcon/> */}
              Privacy Policy
            </button>
            <button
              type="button"
              className="btn btn-outline-primary btn-floating"
              onClick={callAboutUsModal}
            >
              {/* <BookmarkFillIcon/> */}
              About Us
            </button>
          </div>
          <div className="d-flex flex-column">
            <ConfirmModal
              title="Confirm Action"
              content="Are you sure you want to signout?"
              onOk={handleOk}
              onCancel={() => {}}
            >
              <button
                type="button"
                className="btn btn-danger btn-rounded btn-floating"
              >
                Logout
              </button>
            </ConfirmModal>
          </div>
          <Divider />
          <div className="d-flex justify-content-between text-center mt-3 mb-2">
            <div>
              <p className="mb-2 h5">{metadata.totalTrucks}</p>
              <p className="text-muted mb-0">Total Trucks</p>
            </div>
            <div className="px-3">
              <p className="mb-2 h5">{metadata.totalKM}</p>
              <p className="text-muted mb-0">Total KM</p>
            </div>
            <div>
              <p className="mb-2 h5">{metadata.totalDays}</p>
              <p className="text-muted mb-0">Total Days</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-100 d-flex justify-content-center mt-4">
        <p style={{ color: "#808080", fontSize: 12 }}>Developed by codhub</p>
      </div>
      <FloatButton
        shape="circle"
        type="dark"
        style={{
          insetInlineEnd: 16,
          top: 16,
        }}
        onClick={onProfileClose}
        icon={<CloseOutlined />}
      />
      <GetHelpModal ref={getHelpRef} />
      <PrivacyPolicyModal ref={privacyPolicyRef} />
      <AboutUsModal ref={aboutUsRef} />
    </Drawer>
  );
};

export default ProfileDrawer;

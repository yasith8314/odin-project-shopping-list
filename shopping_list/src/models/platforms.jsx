import { 
  FaWindows, FaPlaystation, FaXbox, FaApple, 
  FaAndroid, FaLinux, FaGlobe 
} from 'react-icons/fa';
import { BsNintendoSwitch } from "react-icons/bs";
import { MdPhoneIphone } from 'react-icons/md';

export const PlatformIconGroup = ({ platforms }) => {

    const iconMap = {
    pc: <FaWindows />,
    playstation: <FaPlaystation />,
    xbox: <FaXbox />,
    nintendo: <BsNintendoSwitch />,
    mac: <FaApple />,
    android: <FaAndroid />,
    linux: <FaLinux />,
    ios: <MdPhoneIphone />,
    web: <FaGlobe />,
  };

  return (
    <div style={{ display: 'flex', gap: '8px', color: '#a0a0a0', fontSize: '18px' }}>
      {platforms?.map((slug) => (
        <span key={slug} title={slug}>
          {iconMap[slug] || null}
        </span>
      ))}
    </div>
  );
};
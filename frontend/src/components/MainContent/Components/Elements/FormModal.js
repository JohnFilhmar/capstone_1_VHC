import { MdClose, MdCreate } from "react-icons/md";
import { createContext, useContext, useRef, useState } from 'react';
import { colorTheme } from '../../../../App';
import RecordForm from './Forms/RecordForm';
import PharmacyForm from './Forms/PharmacyForm';
import DonorForm from './Forms/DonorForm';
import NewAppointmentForm from './Forms/NewAppointmentForm';
import NewAccountForm from './Forms/NewAccountForm';
import ConfirmForm from '../../../../hooks/ConfirmForm';
import ImportFileForm from './Forms/ImportFileForm';

const SelectedForm = ({ formType, toggle, importUrl }) => {
  const [selectedTheme] = useContext(colorTheme);
  const renderFormContent = () => {
    switch (formType) {
      case 'records':
        return <RecordForm close={toggle} />;
      case 'pharmacy':
        return <PharmacyForm close={toggle} />;
      case 'blood_unit':
        return <DonorForm close={toggle} />;
      case 'appointments':
        return <NewAppointmentForm close={toggle} />;
      case 'accounts':
        return <NewAccountForm close={toggle} />;
      case 'import':
        return <ImportFileForm close={toggle} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className={`fixed top-0 left-0 right-0 flex justify-between items-center p-5 bg-${selectedTheme}-300 text-${selectedTheme}-800 border-b-[1px] shadow-md drop-shadow-md border-${selectedTheme}-950`}>
        <div className='flex items-center'>
          <MdCreate className='mr-2 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6' />
          <p className='font-bold text-base md:text-lg lg:text-xl'>
            {formType === 'records' && 'Add new record'}
            {formType === 'pharmacy' && 'Add new product'}
            {formType === 'blood_unit' && 'Add new donatee'}
            {formType === 'appointments' && 'Create new appointment'}
            {formType === 'accounts' && 'Add new user'}
            {formType === 'import' && 'Import File'}
          </p>
        </div>
        <button onClick={toggle} className={`transition-colors duration-300 p-2 rounded-3xl bg-${selectedTheme}-400 hover:bg-${selectedTheme}-500 active:bg-${selectedTheme}-200`}>
          <MdClose className='w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6' />
        </button>
      </div>
      {renderFormContent()}
    </div>
  );
};

export const confirmationContext = createContext();

const FormModal = ({ formRef, toggleForm, formType }) => {
  const confirmDialog = useRef(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [cancelMessage, setCancelMessage] = useState("");
  const [backMessage, setBackMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleConfirmDialog = () => {
    if (message) {
      if (isConfirmDialogOpen) {
        setIsConfirmDialogOpen(false);
        confirmDialog.current.close();
      } else {
        setIsConfirmDialogOpen(true);
        confirmDialog.current.showModal();
      }
    }
    setSelectedOption(false);
  };

  const onConfirm = () => {
    setSelectedOption(true);
  };

  const onCancel = () => {
    setSelectedOption(false);
    toggleConfirmDialog();
  };

  const onBack = () => {
    setSelectedOption(false);
    toggleConfirmDialog();
  };

  return (
    <>
      <dialog ref={formRef} className='relative text-xs md:text-sm lg:text-base rounded-lg drop-shadow-lg z-52'>
        <confirmationContext.Provider value={[message, setMessage, confirmMessage, setConfirmMessage, cancelMessage, setCancelMessage, backMessage, setBackMessage, toggleConfirmDialog, selectedOption]}>
          <SelectedForm formType={formType} toggle={toggleForm} />
        </confirmationContext.Provider>
      </dialog>
      <ConfirmForm
        confirmRef={confirmDialog}
        message={message}
        onConfirm={onConfirm}
        confirmMessage={confirmMessage}
        onCancel={onCancel}
        cancelMessage={cancelMessage}
        onBack={onBack}
        backMessage={backMessage}
      />
    </>
  );
};
 
export default FormModal;
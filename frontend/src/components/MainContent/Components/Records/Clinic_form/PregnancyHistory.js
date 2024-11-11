import { useContext, useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import { formDataContext } from "../RecordAudit";

const PregnancyHistory = ({ selectedTheme, gender }) => {
  const [applicablePregnancy, setApplicablePregnancy] = useState(false);
  const {visibleForm, setVisibleForm, pregnancyHistory, setPregnancyHistory} = useContext(formDataContext);

  useEffect(() => {
    const time = setTimeout(() => {
      const oldClinicForm = sessionStorage.getItem('clinicForm') 
        ? JSON.parse(sessionStorage.getItem('clinicForm')) 
        : {};
      const updatedClinicForm = {
        ...oldClinicForm,
        pregnancy_history: pregnancyHistory,
        isPregnancy: applicablePregnancy
      };
      sessionStorage.setItem('clinicForm', JSON.stringify(updatedClinicForm));
    }, 425);
    return () => clearTimeout(time);
  }, [pregnancyHistory, applicablePregnancy]);

  return (
    <div className={`flex flex-col gap-0 p-2 m-2 border-b-2 border-solid border-${selectedTheme}-500 drop-shadow-lg shadow-md rounded-lg`}>
      <div className={`flex gap-1 justify-between mb-2`}>
        <div className="flex gap-1">
          <MdBloodtype className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"/>
          <p className={`text-${selectedTheme}-500 font-bold`}>Pregnancy History</p>
        </div>
        <button disabled={gender === 'male'} onClick={() => setVisibleForm('pregnancy_history')} className={`p-1 rounded-md shadow-md border-${selectedTheme}-500 border-[1px]`}>
          {visibleForm === 'pregnancy_history' ? (
            <FaMinus className="size-4 md:size-5 lg:size-6"/>
          ) : (
            <FaPlus className="size-4 md:size-5 lg:size-6"/>
          )}
        </button>
      </div>
      <div className={visibleForm === 'pregnancy_history' ? 'block' : 'hidden'}>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2">
          <div className={`flex flex-col items-center ${!applicablePregnancy && 'col-span-3'} justify-start gap-3 bg-${selectedTheme}-100 rounded-sm drop-shadow-md p-1`}>
            <label htmlFor="is_applicable_pregnancy" className={`block text-${selectedTheme}-600 font-semibold`}>
              If Pregnancy History Applicable:
            </label>
            <div className="flex items-center space-x-4">
              <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
                <input
                  type="checkbox"
                  checked={applicablePregnancy}
                  onChange={() => setApplicablePregnancy(prev => !prev)}
                  className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
                />
                <span className={`text-${selectedTheme}-600`}>
                  Yes
                </span>
              </label>
              <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
                <input
                  type="checkbox"
                  checked={!applicablePregnancy}
                  onChange={() => setApplicablePregnancy(prev => !prev)}
                  className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
                />
                <span className={`text-${selectedTheme}-600`}>
                  No
                </span>
              </label>
            </div>
          </div>
          <div className={`${applicablePregnancy ? 'block' : 'hidden'} p-2`}>
            <label htmlFor="gravidity" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Number of pregnancy to date-gravidity:</label>
            <input
              type="number"
              id="gravidity"
              name="gravidity"
              value={pregnancyHistory.gravidity}
              onChange={(e) => setPregnancyHistory(prev => ({ ...prev, gravidity: e.target.value }))}
              disabled={!applicablePregnancy}
              className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
            />
          </div>
          <div className={`${applicablePregnancy ? 'block' : 'hidden'} p-2`}>
            <label htmlFor="parity" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Number of delivery to date-parity:</label>
            <input
              type="number"
              id="parity"
              name="parity"
              value={pregnancyHistory.parity}
              onChange={(e) => setPregnancyHistory(prev => ({ ...prev, parity: e.target.value }))}
              disabled={!applicablePregnancy}
              className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
            />
          </div>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 ${applicablePregnancy ? 'block' : 'hidden'}`}>
          <div className="p-2">
            <label htmlFor="delivery_types" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Types of Delivery:</label>
            <input
              type="text"
              id="delivery_types"
              name="delivery_types"
              value={pregnancyHistory.delivery_types}
              onChange={(e) => setPregnancyHistory(prev => ({ ...prev, delivery_types: e.target.value }))}
              disabled={!applicablePregnancy}
              className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
            />
          </div>
          <div className="p-2">
            <label htmlFor="full_term_pregnancies" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Number of Full Term Pregnancies:</label>
            <input
              type="number"
              id="full_term_pregnancies"
              name="full_term_pregnancies"
              value={pregnancyHistory.full_term_pregnancies}
              onChange={(e) => setPregnancyHistory(prev => ({ ...prev, full_term_pregnancies: e.target.value }))}
              disabled={!applicablePregnancy}
              className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
            />
          </div>
          <div className="p-2">
            <label htmlFor="premature_pregnancies" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Number of Pre-mature Pregnancies:</label>
            <input
              type="number"
              id="premature_pregnancies"
              name="premature_pregnancies"
              value={pregnancyHistory.premature_pregnancies}
              onChange={(e) => setPregnancyHistory(prev => ({ ...prev, premature_pregnancies: e.target.value }))}
              disabled={!applicablePregnancy}
              className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
            />
          </div>
        </div>
        <div className={`${applicablePregnancy ? 'block' : 'hidden'} grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2`}>
          <div className="p-2">
            <label htmlFor="abortions" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Number of Abortions:</label>
            <input
              type="number"
              id="abortions"
              name="abortions"
              value={pregnancyHistory.abortions}
              onChange={(e) => setPregnancyHistory(prev => ({ ...prev, abortions: e.target.value }))}
              disabled={!applicablePregnancy}
              className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
            />
          </div>
          <div className="p-2">
            <label htmlFor="living_children" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Number of Living Children:</label>
            <input
              type="number"
              id="living_children"
              name="living_children"
              value={pregnancyHistory.living_children}
              onChange={(e) => setPregnancyHistory(prev => ({ ...prev, living_children: e.target.value }))}
              disabled={!applicablePregnancy}
              className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
            />
          </div>
          <div className="p-2">
            <label htmlFor="pre_eclampsia" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Pre Eclampsia:</label>
            <input
              type="number"
              id="pre_eclampsia"
              name="pre_eclampsia"
              value={pregnancyHistory.pre_eclampsia}
              onChange={(e) => setPregnancyHistory(prev => ({ ...prev, pre_eclampsia: e.target.value }))}
              disabled={!applicablePregnancy}
              className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
            />
          </div>
          <div className={`flex flex-col items-center justify-start gap-3`}>
            <label htmlFor="is_applicable_pregnancy" className={`block text-${selectedTheme}-600 font-semibold`}>
              With Access to Family Planning Counselling:
            </label>
            <div className="flex items-center space-x-4">
              <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
                <input
                  type="checkbox"
                  checked={pregnancyHistory.family_planning_access}
                  onChange={() => setPregnancyHistory(prev => ({ ...prev, family_planning_access: !prev.family_planning_access }))}
                  className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
                  disabled={!applicablePregnancy}
                />
                <span className={`text-${selectedTheme}-600`}>
                  Yes
                </span>
              </label>
              <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
                <input
                  type="checkbox"
                  checked={!pregnancyHistory.family_planning_access}
                  onChange={() => setPregnancyHistory(prev => ({ ...prev, family_planning_access: !prev.family_planning_access }))}
                  className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
                  disabled={!applicablePregnancy}
                />
                <span className={`text-${selectedTheme}-600`}>
                  No
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default PregnancyHistory;
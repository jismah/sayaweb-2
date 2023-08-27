import { NextPage } from 'next';
import Groups from '../../../../components/Groups/Groups/Group';
import WeekDays from '../../../../components/Groups/WeekDays/WeekDays';
import Shifts from '../../../../components/Groups/Shifts/Shifts';
import AcademicYears from '../../../../components/Campaments/AcademicYear/AcademicYear';

const Group: NextPage = () => {



    return (
        <>
            
           
            <Groups/>

            <Shifts/>
            
            <WeekDays/>

            <AcademicYears/>
            
        </>
    )
};

export default Group;
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Briefcase, Users, Book } from 'lucide-react';

interface StaffDetailsProps {
  user: any;
  editedUser: any;
  isEditing: boolean;
  handleRoleDetailsChange: (field: string, value: any) => void;
}

const StaffDetails: React.FC<StaffDetailsProps> = ({ user, editedUser, isEditing, handleRoleDetailsChange }) => {
  return (
    <TabsContent value="professional">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium flex items-center mb-2">
            <Briefcase className="mr-2 h-4 w-4" /> Department
          </label>
          <p className="text-lg">{user.roleDetails.department || 'Not assigned'}</p>
        </div>
        <div>
          <label className="text-sm font-medium flex items-center mb-2">
            <Users className="mr-2 h-4 w-4" /> Batch Coordinator
          </label>
          <p className="text-lg">
            {user.roleDetails.isBatchCoordinator ? 'Yes' : 'No'}
          </p>
        </div>
        {user.roleDetails.subjects && user.roleDetails.subjects.length > 0 && (
          <div className="col-span-2">
            <label className="text-sm font-medium flex items-center mb-2">
              <Book className="mr-2 h-4 w-4" /> Subjects Taught
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {user.roleDetails.subjects.map((subject: { subjectName: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; subjectCode: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; semester: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }, index: React.Key | null | undefined) => (
                <div key={index} className="p-4 border rounded-md bg-gray-50">
                  <p className="font-medium text-primary">{subject.subjectName}</p>
                  <p className="text-sm text-gray-600">Code: {subject.subjectCode}</p>
                  <p className="text-sm text-gray-600">Semester: {subject.semester}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </TabsContent>
  );
};

export default StaffDetails;
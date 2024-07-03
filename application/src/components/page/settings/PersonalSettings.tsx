import React, { FormEvent, useState } from 'react';
import { FieldGroup } from '../../input/fields/FieldGroup';
import { TextField } from '../../input/fields/TextField';
import { SelectField } from '../../input/fields/SelectField';
import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchAllCountries } from '../../../api/CountriesApi';
import { UserModel } from '../../../models/UserModel';
import { TextButton } from '../../input/buttons/TextButton';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateUser } from '../../../api/SettingsPageApi';
import { employeeModelFromUserModel } from '../../../models/EmployeeModel';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../store/reducers/UserReducer';
import { SingleImageUpload } from '../../image/upload/SingleImageUpload';
import { AppRoutes } from '../../../routes';
import { ActionArticle } from '../../action';

interface UserPageProps {
  userData: UserModel
}

interface OptionType {
  value: string
  label: string
}

export const PersonalSettings: React.FC<UserPageProps> = ({ userData }) => {
  const [tempUser, setTempUser] = useState(userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: countries } = useSuspenseQuery<OptionType[], Error>({
    queryKey: ['countries'],
    queryFn: fetchAllCountries
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!tempUser.profileBase64) {
      toast.error('No profile photo provided');
      return;
    }
    try {
      updateUser(employeeModelFromUserModel(tempUser));
    }
    catch (e) {
      toast.error('Failed to update user data');
      return;
    }
    dispatch(setUser(tempUser));
    toast.success('Personal settings saved');
  }

  function updateProfile(image: string): void {
    setEmployeeFieldValue('profileBase64', image);
  }

  const setEmployeeFieldValue = <T extends keyof UserModel>(
    field: T,
    value: UserModel[T]
  ) => {
    setTempUser((prevUser) => {
      return { ...prevUser, [field]: value };
    });
  };

  return (
    <ActionArticle significance={200} emphasis={200}>
      <form
        onSubmit={handleSubmit}
        className="text-left bg-white text-black text-xl pt-6 rounded-lg pb-12 px-24 relative max-w-7xl mx-auto"
      >
        <div className="container relative mx-auto p-10 w-3/4 bg-white z-10 rounded-2xl">
          <div className="absolute w-32 h-32 -ml-44 -mt-6 border rounded-full overflow-hidden">
            <SingleImageUpload
              setImage={image => updateProfile(image)}
              className="rounded-full h-full w-full"
              imageUrl={tempUser.profileBase64}
            />
          </div>
          <ActionArticle.Heading
            significance={200}
            emphasis={200}
          >
            {`${userData.firstName} ${userData.lastName}`}
          </ActionArticle.Heading>

          <ActionArticle.Paragraph
            className="mb-12"
          >
            {userData.jobTitle}
          </ActionArticle.Paragraph>
          <FieldGroup heading="Personal details">
            <div className="flex flex-col lg:flex-row gap-x-1 justify-between">
              <div className="container flex flex-col lg:max-w-[45%]">
                <TextField
                  required
                  placeholder="First Name"
                  label="First name"
                  value={tempUser.firstName}
                  onChange={e => setEmployeeFieldValue('firstName', e.target.value)}
                  className="mb-1"
                />
                <TextField
                  required
                  placeholder="Last Name"
                  label="Last name"
                  value={tempUser.lastName}
                  onChange={e => setEmployeeFieldValue('lastName', e.target.value)}
                  className="mb-1"
                />
              </div>
              <div className="container flex flex-col lg:max-w-[45%]">
                <TextField
                  required
                  placeholder="name@company.com"
                  label="Email"
                  value={tempUser.email}
                  onChange={e => setEmployeeFieldValue('email', e.target.value)}
                  className="mb-1"
                />
                <TextField
                  required
                  placeholder="Developer"
                  label="Job title"
                  value={tempUser.jobTitle}
                  onChange={e => setEmployeeFieldValue('jobTitle', e.target.value)}
                  className="mb-1"
                />
              </div>
            </div>
          </FieldGroup>
          <FieldGroup heading="location">
            <div className="flex flex-col lg:flex-row gap-x-1 justify-between">
              <div className="container flex flex-col lg:max-w-[45%]">
                <TextField
                  required
                  placeholder="Vilnius"
                  label="City"
                  value={tempUser.city}
                  onChange={e => setEmployeeFieldValue('city', e.target.value)}
                />
              </div>
              <div className="container flex flex-col lg:max-w-[45%]">
                <SelectField
                  required
                  placeholder="Select"
                  label="Country"
                  value={tempUser.country}
                  options={countries}
                  onChange={e =>
                    setEmployeeFieldValue('country', e.target.value)}
                  className="rounded-lg text-lg p-2 border border-gray-300 w-full"
                />
              </div>
            </div>
          </FieldGroup>
          <div className="pb-6 mb-6">
            <div className="flex flex-row justify-end py-2">
              <TextButton
                type="button"
                name="Cancel"
                significance={200}
                emphasis={200}
                onClick={() => navigate(AppRoutes.SETTINGS)}
              />
              <TextButton
                name="Save changes"
                significance={400}
                emphasis={400}
                className="ml-2"
              />
            </div>
          </div>
        </div>
      </form>
    </ActionArticle>
  );
};

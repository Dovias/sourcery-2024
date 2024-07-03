import React, { SetStateAction, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

import { getProblemDetailDetailFromError } from '../../../api/apiRequestWrapper/ProblemDetail.ts';
import { fetchAllRoles } from '../../../api/RolesApi.ts';
import { fetchUserGoogleId, fetchUsers, linkGoogle, unlinkGoogle, updateRole } from '../../../api/SettingsPageApi.ts';

import { AuthenticationWithGoogleResponse } from '../../../dto/AuthenticationWithGoogleResponse.tsx';

import { EmployeeModel } from '../../../models/EmployeeModel.tsx';
import { RoleModel } from '../../../models/RoleModel.ts';
import { RootState } from '../../../store/store.ts';

import defaultProfilePicture from '/images/default-profile.jpg';
import { usePermission } from '../../../hooks/usePermission.ts';
import { useDebounce } from '../../../hooks/useDebounce.ts';

import { ActionSectionArticle } from '../../action';
import { ToggleButton } from '../../input/buttons/ToggleButton.tsx';
import { TextButton } from '../../input/buttons/TextButton.tsx';
import { EntryList } from '../../list';
import { Loader } from '../../loader/Loader.tsx';
import { Icon } from '../../icon';
import { PersonalSettings } from './PersonalSettings.tsx';

/*
  FIXME: Let react-router handle subsections.
    Why not have an ability to navigate to personal settings page from address bar?
    (https://devbridge.atlassian.net/browse/RRSF2024S-87)
 */
enum CurrentPage {
  Global_settings,
  Personal_settings,
  Authentication_settings
}

export function Settings() {
  const [loading, setLoading] = useState<boolean>(true);
  const userState = useSelector((state: RootState) => state.user);
  const [employees, setEmployees] = useState<EmployeeModel[]>([]);
  const debounce = useDebounce(500);
  const [googleResponse, setGoogleResponse]
    = useState<null | AuthenticationWithGoogleResponse>(null);

  const canUserEdit = usePermission('ADMIN', 'EDITOR');
  const [pageEnum, setPageEnum] = useState<CurrentPage>(
    canUserEdit
      ? CurrentPage.Global_settings
      : CurrentPage.Personal_settings
  );

  const [roles, setRoles] = useState<RoleModel[]>([]);

  const { text } = useSelector((state: RootState) => state.searchBarText);
  const tryToObtainData = async <T,>(
    promise: Promise<AxiosResponse<T>>,
    setter: React.Dispatch<SetStateAction<T>>,
    errorText: string,
    skipLoading?: boolean
  ) => {
    if (!skipLoading)setLoading(true);
    try {
      const resolvedPromise = await promise;
      setter(resolvedPromise.data);
    }
    catch (error) {
      const serverError = getProblemDetailDetailFromError(error);
      debounce(() => toast.error(serverError || errorText));
    }
    finally {
      setLoading(false);
    }
  };

  const turnOnGlobalSetting = () => {
    tryToObtainData(fetchUsers(text), setEmployees, 'Failed to fetch users');
    setPageEnum(CurrentPage.Global_settings);
  };

  const turnOnPersonalSettings = () => {
    setPageEnum(CurrentPage.Personal_settings);
  };

  const turnOnAuthSettings = () => {
    tryToObtainData(
      fetchUserGoogleId(userState.id),
      setGoogleResponse,
      'Failed to get user Google data'
    );
    setPageEnum(CurrentPage.Authentication_settings);
  };

  useEffect(() => {
    tryToObtainData(
      fetchUsers(text),
      setEmployees,
      'Failed to fetch users',
      pageEnum === CurrentPage.Personal_settings);
  }, [text]);

  useEffect(() => {
    setLoading(true);
    const getRoles = async () => {
      try {
        const fetchedRoles = await fetchAllRoles();
        setRoles(fetchedRoles);
      }
      catch (error) {
        debounce(() => toast.error('Failed to fetch user roles'));
      }
    };
    getRoles();
    return () => {
      setLoading(false);
    };
  }, []);

  const refreshUsers = useCallback(() => {
    tryToObtainData(fetchUsers(text), setEmployees, 'Failed to fetch users');
  }, [userState.email, canUserEdit]);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  function handleUnlinkGoogle() {
    tryToObtainData(
      unlinkGoogle(userState.id),
      setGoogleResponse,
      'Failed to unlink google account'
    );
  }

  const handleLoginGoogle = useGoogleLogin({
    onSuccess: tokenResponse =>
      tryToObtainData(
        linkGoogle(userState.id, tokenResponse.access_token),
        setGoogleResponse,
        'Failed to link google account'
      )
  });

  return (
    <ActionSectionArticle significance={100} emphasis={100}>
      <ActionSectionArticle.Heading>Settings</ActionSectionArticle.Heading>
      <ActionSectionArticle.Paragraph>View and manage who can administrate apartment bookings</ActionSectionArticle.Paragraph>

      <div className="my-8">
        <div className="flex overflow-clip">
          {canUserEdit && (
            <button
              onClick={turnOnGlobalSetting}
              className={`hover:bg-gray-300 text-sm ml-7 p-2 pt-0 -mb-2 rounded-t-xl text-gray-500 ${
              pageEnum == CurrentPage.Global_settings
                ? 'bg-gray-200'
                : 'bg-white'
              }`}
            >
              Global settings
            </button>
          )}
          <button
            onClick={turnOnPersonalSettings}
            className={`hover:bg-gray-300 text-sm bg-white p-2 pt-0 -mb-2 rounded-t-xl text-gray-500 ${
            pageEnum == CurrentPage.Personal_settings
              ? 'bg-gray-200'
              : 'bg-white'
            }`}
          >
            Personal settings
          </button>
          <button
            onClick={turnOnAuthSettings}
            className={`hover:bg-gray-300 text-sm bg-white p-2 pt-0 -mb-2 rounded-t-xl text-gray-500 ${
            pageEnum == CurrentPage.Personal_settings
              ? 'bg-gray-200'
              : 'bg-white'
            }`}
          >
            Authentication settings
          </button>
        </div>
        <div className="text-lg leading-6 bg-gray-200 rounded-xl p-2 pl-6 pr-6 text-gray-500 flex justify-between">
          {pageEnum == CurrentPage.Global_settings && canUserEdit
            ? (
              <>
                <span>System administrator</span>
                <span className="text-right">Editor rights</span>
              </>
              )
            : pageEnum == CurrentPage.Authentication_settings
              ? (
                <>
                  <span>Setting</span>
                </>
                )
              : (
                <>
                  <span>Setting</span>
                  <span className="text-right">Property</span>
                </>
                )}
        </div>
        <ul>
          {pageEnum == CurrentPage.Global_settings && canUserEdit
          && (
            <EntryList significance={200} emphasis={100}>
              {
                loading
                  ? <Loader />
                  : employees.map(({ id, firstName, lastName, jobTitle, city, country, roleId, profileBase64 }, key) => {
                    const getRoleIdByName = (name: string): number | undefined => {
                      return roles.find(role => role.roleName.toUpperCase() === name.toUpperCase())?.roleId;
                    };
                    const handleToggle = async () => {
                      if (roleId && id) {
                        const newRoleId = roleId === getRoleIdByName('USER') ? getRoleIdByName('EDITOR') : getRoleIdByName('USER');

                        if (typeof newRoleId === 'undefined') {
                          toast.error('Role not found. Unable to update.');
                          return;
                        }

                        try {
                          await updateRole(id, newRoleId);

                          toast.success('Role updated successfully');
                          refreshUsers();
                        }
                        catch (error) {
                          toast.error('Failed to apply changes');
                          throw error;
                        }
                      }
                    };

                    return (
                      <EntryList.Entry key={key}>
                        <div className="flex items-center justify-between mx-7">
                          <div className="flex items-center">
                            <img
                              className="size-12 rounded-full object-cover flex-shrink-0"
                              alt="Profile picture"
                              src={profileBase64 || defaultProfilePicture}
                            />
                            <div className="mx-4">
                              <p className="text-xl leading-8">{`${firstName} ${lastName}`}</p>
                              <p className="text-lg leading-6 text-gray-500">
                                {`${jobTitle} `}
                                <span className="inline-block mx-1">•</span>
                                {` ${city}, ${country}`}
                              </p>
                            </div>
                          </div>
                          <ToggleButton
                            active={!!roleId && roleId !== getRoleIdByName('USER')}
                            disabled={roleId === getRoleIdByName('ADMIN') && !canUserEdit}

                            onToggle={handleToggle}
                          />
                        </div>
                      </EntryList.Entry>
                    );
                  })
              }
            </EntryList>
          )}
          {pageEnum == CurrentPage.Personal_settings
          && (loading
            ? <Loader />
            : <PersonalSettings userData={userState} />)}
        </ul>
        <div className="text-lg leading-6 rounded-xl p-2  text-gray-500 flex justify-between">
          {pageEnum == CurrentPage.Authentication_settings && (
            <table className="w-full rounded shadow-md">
              <tbody>
                {googleResponse != null && googleResponse.googleId
                  ? (
                    <tr>
                      <td className="image-cell px-4 py-2 flex items-center space-x-4">
                        <Icon
                          type="google"
                          className="size-16 mt-2 fill-black bg-black/[12%] rounded-full cursor-pointer"
                        >
                        </Icon>
                        <p className="text-lg font-medium">
                          You are linked account to Google account
                        </p>
                      </td>
                      <td className="text-cell px-4 py-2">
                        <TextButton
                          name="Unlink"
                          significance={200}
                          emphasis={400}
                          className="block w-full mt-2"
                          onClick={() => handleUnlinkGoogle()}
                        />
                      </td>
                    </tr>
                    )
                  : (
                    <tr>
                      <td className="image-cell px-4 py-2 flex items-center space-x-4">
                        <Icon
                          type="google"
                          className="size-16 mt-2 fill-black bg-black/[12%] rounded-full cursor-pointer"
                        >
                        </Icon>
                        <p className="text-lg font-medium">
                          You are not linked account to Google account
                        </p>
                      </td>

                      <td className="text-cell px-4 py-2">
                        <TextButton
                          name="Link"
                          significance={400}
                          emphasis={400}
                          className="block w-full mt-2"
                          onClick={() => handleLoginGoogle()}
                        />
                      </td>
                    </tr>
                    )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </ActionSectionArticle>
  );
}

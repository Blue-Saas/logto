import { TenantRole } from '@logto/schemas';
import { getUserDisplayName } from '@logto/shared/universal';
import { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import { z } from 'zod';

import { useAuthedCloudApi } from '@/cloud/hooks/use-cloud-api';
import { type TenantMemberResponse } from '@/cloud/types/router';
import { TenantsContext } from '@/contexts/TenantsProvider';
import Button from '@/ds-components/Button';
import FormField from '@/ds-components/FormField';
import ModalLayout from '@/ds-components/ModalLayout';
import Select from '@/ds-components/Select';
import * as modalStyles from '@/scss/modal.module.scss';

type Props = {
  user: TenantMemberResponse;
  isOpen: boolean;
  onClose: () => void;
};

function EditMemberModal({ user, isOpen, onClose }: Props) {
  const { t } = useTranslation(undefined, { keyPrefix: 'admin_console.tenant_members' });
  const { currentTenantId } = useContext(TenantsContext);

  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState(TenantRole.Member);
  const cloudApi = useAuthedCloudApi();

  const roleOptions = useMemo(
    () => [
      { value: TenantRole.Admin, title: t('admin') },
      { value: TenantRole.Member, title: t('member') },
    ],
    [t]
  );

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      await cloudApi.put(`/api/tenants/:tenantId/members/:userId/roles`, {
        params: { tenantId: currentTenantId, userId: user.id },
        body: { roleName: role },
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      className={modalStyles.content}
      overlayClassName={modalStyles.overlay}
      onRequestClose={onClose}
    >
      <ModalLayout
        title={<>{t('edit_modal.title', { name: getUserDisplayName(user) })}</>}
        footer={
          <Button
            size="large"
            type="primary"
            title="general.save"
            isLoading={isLoading}
            onClick={onSubmit}
          />
        }
        onClose={onClose}
      >
        <FormField title="tenant_members.roles">
          <Select
            options={roleOptions}
            value={role}
            onChange={(value) => {
              const guardResult = z.nativeEnum(TenantRole).safeParse(value);
              setRole(guardResult.success ? guardResult.data : TenantRole.Member);
            }}
          />
        </FormField>
      </ModalLayout>
    </ReactModal>
  );
}

export default EditMemberModal;
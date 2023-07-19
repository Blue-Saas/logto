import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import FreePlanNotificationImage from '@/assets/images/free-plan-notification-image.svg';
import PlanName from '@/components/PlanName';
import { isCloud, isProduction } from '@/consts/env';
import { ReservedPlanId } from '@/consts/subscriptions';
import Button from '@/ds-components/Button';
import useCurrentSubscription from '@/hooks/use-current-subscription';
import { ReservedPlanName } from '@/types/subscriptions';

import * as styles from './index.module.scss';

function FreePlanNotification() {
  const { data: currentSubscription, error } = useCurrentSubscription();
  const { t } = useTranslation(undefined, { keyPrefix: 'admin_console.upsell.get_started' });
  const navigate = useNavigate();
  const isLoadingSubscription = !currentSubscription && !error;

  if (
    /**
     * Todo: @xiaoyijun remove this condition on subscription features ready.
     */
    isProduction ||
    !isCloud ||
    isLoadingSubscription ||
    !currentSubscription ||
    currentSubscription.planId !== ReservedPlanId.free
  ) {
    return null;
  }

  return (
    <div className={styles.container}>
      <FreePlanNotificationImage className={styles.image} />
      <div>
        <div className={styles.title}>
          <Trans
            components={{
              planName: <PlanName name={ReservedPlanName.Free} />,
            }}
          >
            {t('title')}
          </Trans>
        </div>
        <div className={styles.description}>
          <Trans
            components={{
              planName: <PlanName name={ReservedPlanName.Free} />,
            }}
          >
            {t('description')}
          </Trans>
        </div>
      </div>
      <Button
        title="upsell.get_started.view_plans"
        type="outline"
        className={styles.button}
        size="large"
        onClick={() => {
          navigate('/tenant-settings/subscription');
        }}
      />
    </div>
  );
}

export default FreePlanNotification;
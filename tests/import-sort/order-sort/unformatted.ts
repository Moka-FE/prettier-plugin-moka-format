import { connect, ConnectedProps } from 'react-redux';
import { SelectProps } from 'sugar-design/types/lib/components/Select/Select';
import { Form, Menu, Modal, Select, sendMessage, Spacing, Tag } from 'sugar-design';
import * as sdf from '@SDFoundation';
import { RootState , Application } from '../../reducers';
import SelectEmailTemplate from '../candidates/interview/editModal/components/SelectEmailTemplate/SelectEmailTemplate';
import { EMAIL_TYPE } from '../candidates/interview/editModal/components/SelectEmailTemplate/utils';
import ValidateDetailAlert from '../common/batchOperationValidate/ValidateDetailAlert';
import styles from './AddCandidatesToAppointmentModal.cm.styl';
// comment 3
import { getI18n } from '../../../common/i18n';
import {
  addScheduleInterviewApplication,
  checkAlreadyBookedApplicationIds,
  getAppointmentInterviewList,
  getInterviewNotificationInfo,
  prepareForBulkCreateInterviews,
} from '../../actions/interview';
import { ValidResultMap } from '../../models/batchValidate';
import {App} from '@/App'
// comment 1
import {
  AppointmentInterview,
  InterviewNotificationInfo,
  NotificationType,
} from '../../models/interview';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'; // comment 2
import cms from '@cms';
import classNames from 'classnames';
import { BATCH_VALIDATE_TYPE } from '../../../common/constant';
// comment 4
import { PropsWithRouteConfig, withRouter } from 'mage-react-router';




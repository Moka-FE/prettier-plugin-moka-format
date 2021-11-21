import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// comment 4
import { PropsWithRouteConfig, withRouter } from 'mage-react-router';
import classNames from 'classnames';
import { SelectProps } from 'sugar-design/types/lib/components/Select/Select';
import { Form, Menu, Modal, Select, sendMessage, Spacing, Tag } from 'sugar-design';
import * as sdf from '@SDFoundation';
// comment 2
import cms from '@cms';

import { ValidResultMap } from '../../models/batchValidate';
import SelectEmailTemplate from '../candidates/interview/editModal/components/SelectEmailTemplate/SelectEmailTemplate';
import ValidateDetailAlert from '../common/batchOperationValidate/ValidateDetailAlert';

import { BATCH_VALIDATE_TYPE } from '../../../common/constant';
// comment 3
import { getI18n } from '../../../common/i18n';
import {
    addScheduleInterviewApplication,
    checkAlreadyBookedApplicationIds,
    getAppointmentInterviewList,
    getInterviewNotificationInfo,
    prepareForBulkCreateInterviews,
} from '../../actions/interview';
// comment 1
import {
    AppointmentInterview,
    InterviewNotificationInfo,
    NotificationType,
} from '../../models/interview';
import { RootState, Application } from '../../reducers';
import { EMAIL_TYPE } from '../candidates/interview/editModal/components/SelectEmailTemplate/utils';

import styles from './AddCandidatesToAppointmentModal.cm.styl';

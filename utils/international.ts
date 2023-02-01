import { MessageDescriptor, PrimitiveType, useIntl } from "react-intl"

const useMessage = () => {
  const intl = useIntl();
  return {
    message: (id: MessageDescriptor['id'], values?: Record<string, any>) => intl.formatMessage({ id }, values),
  }
}

export default useMessage;
import { DefaultFooter } from '@ant-design/pro-components';

const Footer: React.FC = () => {
  const defaultMessage = 'And_Sue';

  return (
    <DefaultFooter
      copyright={`${defaultMessage}`}
    />
  );
};

export default Footer;

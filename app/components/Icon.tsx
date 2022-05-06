type IconProps = {
  iconName: string;
  type?: 'line' | 'fill';
  onClick?: () => void;
};

const Icon = ({ iconName, type = 'line', onClick }: IconProps) => {
  return <i onClick={onClick} className={`ri-${iconName}-${type} ri-fw`}></i>;
};

export default Icon;

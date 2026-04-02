import { AlignCenterIcon } from './icons/AlignCenter';
import { AlignLeftIcon } from './icons/AlignLeft';
import { AlignRightIcon } from './icons/AlignRight';
import { ArrowIcon } from './icons/Arrow';
import { BellIcon } from './icons/Bell';
import { BoldIcon } from './icons/Bold';
import { CalendarIcon } from './icons/Calendar';
import { ChatIcon } from './icons/Chat';
import { CheckIcon } from './icons/Check';
import { CheckBoxIcon } from './icons/CheckBox';
import { CheckBoxDIcon } from './icons/CheckBoxD';
import { CheckMiniIcon } from './icons/CheckMini';
import { CloseIcon } from './icons/Close';
import { DashboardIcon } from './icons/Dashboard';
import { DeleteIcon } from './icons/Delete';
import { DotsIcon } from './icons/Dots';
import { DotsCircleIcon } from './icons/DotsCircle';
import { DoubleArrowIcon } from './icons/DoubleArrow';
import { EditIcon } from './icons/Edit';
import { EyeIcon } from './icons/Eye';
import { EyeOffIcon } from './icons/EyeOff';
import { FilledStarIcon } from './icons/FilledStar';
import { FilterIcon } from './icons/Filter';
import { FlagIcon } from './icons/Flag';
import { FlagLineIcon } from './icons/FlagLine';
import { GoogleIcon } from './icons/GoogleIcon';
import { HamburgerIcon } from './icons/Hamburger';
import { ImageIcon } from './icons/Image';
import { ItalicIcon } from './icons/Italic';
import { KakaoIcon } from './icons/Kakao';
import { LinkIcon } from './icons/Link';
import { LinkEditorIcon } from './icons/LinkEditor';
import { ListIcon } from './icons/List';
import { LogoutIcon } from './icons/Logout';
import { MessageIcon } from './icons/Message';
import { MoonIcon } from './icons/Moon';
import { MoreIcon } from './icons/More';
import { NoteIcon } from './icons/Note';
import { OutlineStarIcon } from './icons/OutlineStar';
import { PencilIcon } from './icons/Pencil';
import { PlusIcon } from './icons/Plus';
import { ScheduleIcon } from './icons/Schedule';
import { SearchIcon } from './icons/Search';
import { SettingIcon } from './icons/Setting';
import { SunIcon } from './icons/Sun';
import { TaskIcon } from './icons/Task';
import { UnderlineIcon } from './icons/UnderLine';
import { WarningIcon } from './icons/Warning';

const icons = {
  checkBox: CheckBoxIcon,
  checkBoxD: CheckBoxDIcon,
  note: NoteIcon,
  link: LinkIcon,
  dashboard: DashboardIcon,
  flag: FlagIcon,
  flagLine: FlagLineIcon,
  delete: DeleteIcon,
  doubleArrow: DoubleArrowIcon,
  bell: BellIcon,
  check: CheckIcon,
  message: MessageIcon,
  filledStar: FilledStarIcon,
  outlineStar: OutlineStarIcon,
  calendar: CalendarIcon,
  google: GoogleIcon,
  kakao: KakaoIcon,
  edit: EditIcon,
  more: MoreIcon,
  arrow: ArrowIcon,
  eyeOff: EyeOffIcon,
  logout: LogoutIcon,
  setting: SettingIcon,
  schedule: ScheduleIcon,
  warning: WarningIcon,
  task: TaskIcon,
  hamburger: HamburgerIcon,
  eye: EyeIcon,
  filter: FilterIcon,
  pencil: PencilIcon,
  chat: ChatIcon,
  search: SearchIcon,
  checkMini: CheckMiniIcon,
  dots: DotsIcon,
  plus: PlusIcon,
  sun: SunIcon,
  moon: MoonIcon,
  dotscircle: DotsCircleIcon,
  close: CloseIcon,
  bold: BoldIcon,
  italic: ItalicIcon,
  underline: UnderlineIcon,
  alignLeft: AlignLeftIcon,
  alignCenter: AlignCenterIcon,
  alignRight: AlignRightIcon,
  list: ListIcon,
  image: ImageIcon,
  linkEditor: LinkEditorIcon,
};

export type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
  checked?: boolean;
  variant?: 'default' | 'orange' | 'white' | 'filled';
  direction?: 'left' | 'right' | 'up' | 'down';
  color?: string;
};

export const Icon = ({
  name,
  size = 24,
  className,
  checked,
  variant,
  direction,
  color,
}: IconProps) => {
  //// Record<string, unknown> = "어떤 props든 다 받을 수 있어" 라고 타입을 느슨하게 만드는 것
  const Component = icons[name] as React.ComponentType<Record<string, unknown>>;

  return (
    <Component
      width={size}
      height={size}
      variant={variant}
      className={className}
      checked={checked}
      direction={direction}
      color={color}
    />
  );
};

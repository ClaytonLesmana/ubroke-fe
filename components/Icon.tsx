import React from 'react';
import Svg, { Path, Rect, G, Defs, Filter, FeFlood, FeColorMatrix, FeOffset, FeGaussianBlur, FeComposite } from 'react-native-svg';

interface IconProps {
  name: 'leftArrow' | 'rightArrow' | 'settingsIcon' | 'notificationIcon' | 'addIcon' | 'upIcon' | 'downIcon' | 'backIcon' | 'attachmentIcon' | 'upTrendIcon' | 'downTrendIcon' | 'calendarIcon' | 'documentIcon' | 'searchIcon' | 'crossIcon' | 'sendIcon' | 'addCircleIcon' | 'passwordIcon' | 'passwordHiddenIcon' | 'googleIcon';
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 16, color = '#848484', strokeWidth = 1.5 }: IconProps) {
  const icons = {
    leftArrow: (
      <Svg width={size} height={size * 1.75} viewBox="0 0 8 14" fill="none">
        <Path
          d="M7 13L1 7L7 1"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
    rightArrow: (
      <Svg width={size} height={size * 1.75} viewBox="0 0 8 14" fill="none">
        <Path
          d="M1 13L7 7L1 1"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
    settingsIcon: (
      <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <Path
          d="M8.325 2.317C8.751 0.561 11.249 0.561 11.675 2.317C11.7389 2.5808 11.8642 2.82578 12.0407 3.032C12.2172 3.23822 12.4399 3.39985 12.6907 3.50375C12.9414 3.60764 13.2132 3.65085 13.4838 3.62987C13.7544 3.60889 14.0162 3.5243 14.248 3.383C15.791 2.443 17.558 4.209 16.618 5.753C16.4769 5.98466 16.3924 6.24634 16.3715 6.51677C16.3506 6.78721 16.3938 7.05877 16.4975 7.30938C16.6013 7.55999 16.7627 7.78258 16.9687 7.95905C17.1747 8.13553 17.4194 8.26091 17.683 8.325C19.439 8.751 19.439 11.249 17.683 11.675C17.4192 11.7389 17.1742 11.8642 16.968 12.0407C16.7618 12.2172 16.6001 12.4399 16.4963 12.6907C16.3924 12.9414 16.3491 13.2132 16.3701 13.4838C16.3911 13.7544 16.4757 14.0162 16.617 14.248C17.557 15.791 15.791 17.558 14.247 16.618C14.0153 16.4769 13.7537 16.3924 13.4832 16.3715C13.2128 16.3506 12.9412 16.3938 12.6906 16.4975C12.44 16.6013 12.2174 16.7627 12.0409 16.9687C11.8645 17.1747 11.7391 17.4194 11.675 17.683C11.249 19.439 8.751 19.439 8.325 17.683C8.26108 17.4192 8.13578 17.1742 7.95929 16.968C7.7828 16.7618 7.56011 16.6001 7.30935 16.4963C7.05859 16.3924 6.78683 16.3491 6.51621 16.3701C6.24559 16.3911 5.98375 16.4757 5.752 16.617C4.209 17.557 2.442 15.791 3.382 14.247C3.5231 14.0153 3.60755 13.7537 3.62848 13.4832C3.64942 13.2128 3.60624 12.9412 3.50247 12.6906C3.3987 12.44 3.23726 12.2174 3.03127 12.0409C2.82529 11.8645 2.58056 11.7391 2.317 11.675C0.561 11.249 0.561 8.751 2.317 8.325C2.5808 8.26108 2.82578 8.13578 3.032 7.95929C3.23822 7.7828 3.39985 7.56011 3.50375 7.30935C3.60764 7.05859 3.65085 6.78683 3.62987 6.51621C3.60889 6.24559 3.5243 5.98375 3.383 5.752C2.443 4.209 4.209 2.442 5.753 3.382C6.753 3.99 8.049 3.452 8.325 2.317Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M7 10C7 10.7956 7.31607 11.5587 7.87868 12.1213C8.44129 12.6839 9.20435 13 10 13C10.7956 13 11.5587 12.6839 12.1213 12.1213C12.6839 11.5587 13 10.7956 13 10C13 9.20435 12.6839 8.44129 12.1213 7.87868C11.5587 7.31607 10.7956 7 10 7C9.20435 7 8.44129 7.31607 7.87868 7.87868C7.31607 8.44129 7 9.20435 7 10Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
    notificationIcon: (
      <Svg width={size} height={size * 1.11} viewBox="0 0 18 20" fill="none">
        <Path
          d="M6 15V16C6 16.7957 6.31607 17.5587 6.87868 18.1213C7.44129 18.6839 8.20435 19 9 19C9.79565 19 10.5587 18.6839 11.1213 18.1213C11.6839 17.5587 12 16.7957 12 16V15M7 3C7 2.46957 7.21071 1.96086 7.58579 1.58579C7.96086 1.21071 8.46957 1 9 1C9.53043 1 10.0391 1.21071 10.4142 1.58579C10.7893 1.96086 11 2.46957 11 3C12.1484 3.54303 13.1274 4.38833 13.832 5.4453C14.5367 6.50227 14.9404 7.73107 15 9V12C15.0753 12.6217 15.2954 13.2171 15.6428 13.7381C15.9902 14.2592 16.4551 14.6914 17 15H1C1.54494 14.6914 2.00981 14.2592 2.35719 13.7381C2.70457 13.2171 2.92474 12.6217 3 12V9C3.05956 7.73107 3.4633 6.50227 4.16795 5.4453C4.8726 4.38833 5.85159 3.54303 7 3Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
    addIcon: (
      <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
        <Path
          d="M6 0.75V11.25M0.75 6H11.25"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
    upIcon: (
      <Svg width={size} height={size * 0.57} viewBox="0 0 14 8" fill="none">
        <Path
          d="M1 7L7 1L13 7"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
    downIcon: (
      <Svg width={size} height={size * 0.57} viewBox="0 0 14 8" fill="none">
        <Path
          d="M1 1L7 7L13 1"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
    backIcon: (
      <Svg width={size} height={size * 0.92} viewBox="0 0 13 12" fill="none">
        <Path
          d="M1 6H12M1 6L5.88889 11M1 6L5.88889 1"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
    attachmentIcon: (
      <Svg width={size} height={size * 1.06} viewBox="0 0 17 18" fill="none">
        <Path
          d="M10.5002 4.83339L5.08351 10.2501C4.75199 10.5816 4.56575 11.0312 4.56575 11.5001C4.56575 11.9689 4.75199 12.4185 5.08351 12.7501C5.41503 13.0816 5.86467 13.2678 6.33351 13.2678C6.80235 13.2678 7.25199 13.0816 7.58351 12.7501L13.0002 7.33339C13.6632 6.67034 14.0357 5.77107 14.0357 4.83339C14.0357 3.8957 13.6632 2.99643 13.0002 2.33339C12.3371 1.67034 11.4379 1.29785 10.5002 1.29785C9.5625 1.29785 8.66322 1.67034 8.00018 2.33339L2.58351 7.75005C1.58895 8.74461 1.03021 10.0935 1.03021 11.5001C1.03021 12.9066 1.58895 14.2555 2.58351 15.2501C3.57807 16.2446 4.92699 16.8034 6.33351 16.8034C7.74004 16.8034 9.08895 16.2446 10.0835 15.2501L15.5002 9.83339"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
    upTrendIcon: (
      <Svg width={size} height={size * 0.71} viewBox="0 0 14 10" fill="none">
        <Path
          d="M1 8.33335L5 4.33335L7.66667 7.00002L13 1.66669M13 1.66669H8.33333M13 1.66669V6.33335"
          stroke="#287F6E"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
    downTrendIcon: (
      <Svg width={size} height={size * 0.64} viewBox="0 0 14 9" fill="none">
        <Path
          d="M1 1.00002L5 5.00002L7.66667 2.33335L13 7.66669M13 7.66669H8.33333M13 7.66669V3.00002"
          stroke="#DF1C41"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
    calendarIcon: (
      <Svg width={size} height={size * 1.11} viewBox="0 0 18 20" fill="none">
        <Path
          d="M13 1V5M5 1V5M1 9H17M1 5C1 4.46957 1.21071 3.96086 1.58579 3.58579C1.96086 3.21071 2.46957 3 3 3H15C15.5304 3 16.0391 3.21071 16.4142 3.58579C16.7893 3.96086 17 4.46957 17 5V17C17 17.5304 16.7893 18.0391 16.4142 18.4142C16.0391 18.7893 15.5304 19 15 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V5ZM5 13H7V15H5V13Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
    documentIcon: (
      <Svg width={size} height={size * 1.22} viewBox="0 0 18 22" fill="none">
        <Path
          d="M11.2857 1V5.44444C11.2857 5.73913 11.4061 6.02174 11.6205 6.23012C11.8348 6.43849 12.1255 6.55556 12.4286 6.55556H17M11.2857 1H3.28571C2.67951 1 2.09812 1.23413 1.66947 1.65087C1.24082 2.06762 1 2.63285 1 3.22222V18.7778C1 19.3671 1.24082 19.9324 1.66947 20.3491C2.09812 20.7659 2.67951 21 3.28571 21H14.7143C15.3205 21 15.9019 20.7659 16.3305 20.3491C16.7592 19.9324 17 19.3671 17 18.7778V6.55556M11.2857 1L17 6.55556M5.57143 7.66667H6.71429M5.57143 12.1111H12.4286M5.57143 16.5556H12.4286"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
    searchIcon: (
      <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
        <Path
          d="M16.5 16.5L11.5 11.5M1.5 7.33333C1.5 8.09938 1.65088 8.85792 1.94404 9.56565C2.23719 10.2734 2.66687 10.9164 3.20854 11.4581C3.75022 11.9998 4.39328 12.4295 5.10101 12.7226C5.80875 13.0158 6.56729 13.1667 7.33333 13.1667C8.09938 13.1667 8.85792 13.0158 9.56565 12.7226C10.2734 12.4295 10.9164 11.9998 11.4581 11.4581C11.9998 10.9164 12.4295 10.2734 12.7226 9.56565C13.0158 8.85792 13.1667 8.09938 13.1667 7.33333C13.1667 6.56729 13.0158 5.80875 12.7226 5.10101C12.4295 4.39328 11.9998 3.75022 11.4581 3.20854C10.9164 2.66687 10.2734 2.23719 9.56565 1.94404C8.85792 1.65088 8.09938 1.5 7.33333 1.5C6.56729 1.5 5.80875 1.65088 5.10101 1.94404C4.39328 2.23719 3.75022 2.66687 3.20854 3.20854C2.66687 3.75022 2.23719 4.39328 1.94404 5.10101C1.65088 5.80875 1.5 6.56729 1.5 7.33333Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
    crossIcon: (
      <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
        <Path
          d="M11 1L1 11M1 1L11 11"
          stroke="#BE1931"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
    sendIcon: (
      <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
        <Rect width="44" height="44" rx="22" fill="#936DFF"/>
        <Path d="M13 30V24L21 22L13 20V14L32 22L13 30Z" fill="white"/>
      </Svg>
    ),
    addCircleIcon: (
      <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
        <G filter="url(#filter0_d_602_1178)">
          <Rect x="4" y="4" width="48" height="48" rx="24" fill="#936DFF"/>
          <Path d="M28 19V37M19 28H37" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </G>
        <Defs>
                     <Filter id="filter0_d_602_1178" x="0" y="0" width="56" height="56" filterUnits="userSpaceOnUse">
            <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
            <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <FeOffset/>
            <FeGaussianBlur stdDeviation="2"/>
            <FeComposite in2="hardAlpha" operator="out"/>
            <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          </Filter>
        </Defs>
      </Svg>
    ),
    passwordIcon: (
      <Svg width={size} height={size * 0.67} viewBox="0 0 18 12" fill="none">
        <Path
          d="M7.33333 6C7.33333 6.44203 7.50893 6.86595 7.82149 7.17851C8.13405 7.49107 8.55797 7.66667 9 7.66667C9.44203 7.66667 9.86595 7.49107 10.1785 7.17851C10.4911 6.86595 10.6667 6.44203 10.6667 6C10.6667 5.55797 10.4911 5.13405 10.1785 4.82149C9.86595 4.50893 9.44203 4.33333 9 4.33333C8.55797 4.33333 8.13405 4.50893 7.82149 4.82149C7.50893 5.13405 7.33333 5.55797 7.33333 6Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M16.5 6C14.5 9.33333 12 11 9 11C6 11 3.5 9.33333 1.5 6C3.5 2.66667 6 1 9 1C12 1 14.5 2.66667 16.5 6Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
    passwordHiddenIcon: (
      <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
        <Path
          d="M7.82089 7.82248C7.50837 8.1351 7.33285 8.55907 7.33293 9.00111C7.333 9.44315 7.50868 9.86705 7.8213 10.1796C8.13393 10.4921 8.55789 10.6676 8.99993 10.6675C9.44197 10.6674 9.86587 10.4918 10.1784 10.1791M12.9008 12.8942C11.7319 13.6256 10.3789 14.0091 9 14C6 14 3.5 12.3334 1.5 9.00003C2.56 7.23336 3.76 5.93503 5.1 5.10503M7.48333 4.15002C7.98253 4.04897 8.49068 3.99871 9 4.00002C12 4.00002 14.5 5.66669 16.5 9.00003C15.945 9.92503 15.3508 10.7225 14.7183 11.3917M1.5 1.5L16.5 16.5"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
    googleIcon: (
      <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
        <Path
          d="M16.8758 9.1749C16.8758 8.5274 16.8222 8.0549 16.7061 7.56491H9.1615V10.4874H13.59C13.5008 11.2136 13.0186 12.3074 11.9472 13.0424L11.9322 13.1402L14.3176 14.9512L14.4829 14.9674C16.0007 13.5936 16.8758 11.5724 16.8758 9.1749Z"
          fill="#4285F4"
        />
        <Path
          d="M9.16098 16.875C11.3306 16.875 13.152 16.175 14.4824 14.9675L11.9467 13.0424C11.2681 13.5062 10.3574 13.8299 9.16098 13.8299C7.03601 13.8299 5.23246 12.4562 4.58954 10.5574L4.4953 10.5653L2.01486 12.4465L1.98242 12.5349C3.30383 15.1074 6.01811 16.875 9.16098 16.875Z"
          fill="#34A853"
        />
        <Path
          d="M4.59004 10.5575C4.4204 10.0675 4.32223 9.54245 4.32223 8.99997C4.32223 8.45744 4.4204 7.93246 4.58112 7.44247L4.57662 7.33811L2.06509 5.42664L1.98291 5.46494C1.4383 6.53245 1.12579 7.73123 1.12579 8.99997C1.12579 10.2687 1.4383 11.4674 1.98291 12.5349L4.59004 10.5575Z"
          fill="#FBBC05"
        />
        <Path
          d="M9.16103 4.16998C10.6699 4.16998 11.6878 4.80873 12.2682 5.34251L14.536 3.1725C13.1432 1.90375 11.3306 1.125 9.16103 1.125C6.01814 1.125 3.30384 2.89249 1.98242 5.46497L4.58063 7.44249C5.23248 5.54375 7.03604 4.16998 9.16103 4.16998Z"
          fill="#EB4335"
        />
      </Svg>
    ),
  };

  return icons[name] || null;
} 
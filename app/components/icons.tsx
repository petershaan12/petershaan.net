import { AiFillLinkedin, AiFillYoutube, AiFillInstagram } from "react-icons/ai";
import { BsGithub } from "react-icons/bs";
type IconProps = React.HTMLAttributes<SVGElement>;
const logo = "</ps>";

export const Icons = {
  logo: (props: IconProps) => <p className="font-bold opacity-50">{logo}</p>,
  instagram: (props: IconProps) => <AiFillInstagram />,
  youtube: (props: IconProps) => <AiFillYoutube />,
  linkedin: (props: IconProps) => <AiFillLinkedin />,
  gitHub: (props: IconProps) => <BsGithub />,
};
import {SportsFrame} from "../ToolsShared";
import {SportsQuiz} from "../SportsQuiz";
import {athletes,sportsPhoto} from "../data";
import {sportsTeams} from "../catalog";
import {knowledgeQuestions,type SportsQuestion} from "../quiz-data";
import {pageMetadata} from "../../seo";
export const metadata=pageMetadata("/sports/quiz","Sports quizzes | TerraScope","Guess athletes, identify team badges and test your sports knowledge.");
export default function QuizPage(){
 const faces:SportsQuestion[]=athletes.flatMap(p=>{const photo=sportsPhoto(p.id);return photo?[{id:`face-${p.id}`,mode:"faces",prompt:"Who is this athlete?",image:photo.src,answer:p.name,options:[p.name,...athletes.filter(x=>x.sport===p.sport&&x.id!==p.id).slice(0,3).map(x=>x.name)],explanation:`${p.name} · ${p.nation}. ${p.highlight}`,source:p.sources[0].url,credit:photo}]:[];});
 const badges:SportsQuestion[]=sportsTeams.filter(t=>t.badge).map(t=>({id:`badge-${t.id}`,mode:"badges",prompt:"Which team uses this badge?",image:t.badge,answer:t.name,options:[t.name,...sportsTeams.filter(x=>x.id!==t.id&&x.badge).slice(0,3).map(x=>x.name)],explanation:`${t.name} · ${t.location}. ${t.honours[0]}.`,source:t.sources[0].url}));
 return <SportsFrame path="/sports/quiz" title="How well do you know the game?" intro="Recognise the faces, identify the badges and put your championship knowledge to the test."><SportsQuiz bank={[...faces,...badges,...knowledgeQuestions]}/><p className="sp-small">Badge images: ESPN team identity assets. Portrait credits are shown with each answer.</p></SportsFrame>;
}

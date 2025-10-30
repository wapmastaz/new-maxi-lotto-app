import { FAQ_DATA } from "@/constants/faq";
import { CircleQuestionMark } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const FaqData = () => {
  return (
    <Accordion indicator="plus" type="single" variant="solid" collapsible className="w-full lg:w-[75%]">

      {FAQ_DATA.map((item, index) => (
        <AccordionItem className="bg-primary-900 rounded-2xl p-4" value={`faq-${index}`} key={index}>
          <div className="flex gap-4 items-center">
            {/* icon */}
            <CircleQuestionMark size={24} className="text-yellow-300" />
            <AccordionTrigger className="text-white flex flex-1 w-full font-montserrat text-sm font-extrabold">
              {item.question}
            </AccordionTrigger>
          </div>

          <AccordionContent className="text-white p-4">{item.answer}</AccordionContent>
        </AccordionItem>
      ))}

    </Accordion>

  )
}

export default FaqData
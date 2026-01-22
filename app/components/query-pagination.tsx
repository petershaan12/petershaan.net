import { useLocation, useNavigate } from "@remix-run/react";  
import {  
  Pagination,  
  PaginationContent,  
  PaginationItem,  
  PaginationLink,  
  PaginationPrevious,  
  PaginationNext,  
} from "./ui/pagination";  
  
interface QueryPaginationProps {  
  totalPages: number;  
  className?: string;  
  currentPage?: number;
}  

  
export function QueryPagination({ totalPages, className }: QueryPaginationProps) {  
  const location = useLocation();  
  const navigate = useNavigate();  
  
  const searchParams = new URLSearchParams(location.search);  
  const currentPage = Number(searchParams.get("page")) || 1;  
  
  const prevPage = currentPage - 1;  
  const nextPage = currentPage + 1;  
  
  const createPageURL = (pageNumber: number) => {  
    const params = new URLSearchParams(searchParams);  
    params.set("page", pageNumber.toString());  
    return `?${params.toString()}`;  
  };  
  
  const handlePageChange = (pageNumber: number) => {  
    navigate(createPageURL(pageNumber));  
  };  
  
  return (  
    <Pagination className={className}>  
      <PaginationContent>  
        {prevPage >= 1 && (  
          <PaginationItem>  
            <PaginationPrevious href={createPageURL(prevPage)} />  
          </PaginationItem>  
        )}  
  
        {Array.from({ length: totalPages }, (_, index) => (  
          <PaginationItem  
            className="hidden sm:inline-block"  
            key={`page-button-${index}`}  
          >  
            <PaginationLink  
              isActive={currentPage === index + 1}  
              href={createPageURL(index + 1)}
            >  
              {index + 1}  
            </PaginationLink>  
          </PaginationItem>  
        ))}  
  
        {nextPage <= totalPages && (  
          <PaginationItem>  
            <PaginationNext href={createPageURL(nextPage)} />  
          </PaginationItem>  
        )}  
      </PaginationContent>  
    </Pagination>  
  );  
}  

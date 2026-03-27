package in.bouziani.billingsoftwar.controller;

import in.bouziani.billingsoftwar.io.CategoryRequest;
import in.bouziani.billingsoftwar.io.CategoryResponse;
import in.bouziani.billingsoftwar.service.impl.CategoryServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryServiceImpl categoryService;
    @PostMapping("/admin/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse addCategory(@RequestPart("category") String categoryString,
                                        @RequestPart("file")MultipartFile file){
        ObjectMapper objectMapper = new ObjectMapper();
        CategoryRequest request = null;
        try{
            request = objectMapper.readValue(categoryString , CategoryRequest.class);
            return categoryService.add(request,file);
        }
        catch(JacksonException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Exeption occured while parsing the json");
        }
    }
    @GetMapping("/categories")
    public List<CategoryResponse> readAllCategories(){
        return categoryService.read();
    }
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/admin/categories/{categoryId}")
    public void deleteCategory(@PathVariable String categoryId){
        try{
            categoryService.delete(categoryId);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND , e.getMessage());
        }
    }
}

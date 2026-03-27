package in.bouziani.billingsoftwar.service.impl;

import in.bouziani.billingsoftwar.entity.CategoryEntity;
import in.bouziani.billingsoftwar.io.CategoryRequest;
import in.bouziani.billingsoftwar.io.CategoryResponse;
import in.bouziani.billingsoftwar.repositry.CategoryRepositry;
import in.bouziani.billingsoftwar.repositry.ItemRepositry;
import in.bouziani.billingsoftwar.service.CategoryService;
import in.bouziani.billingsoftwar.service.ActivityLogService;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepositry categoryRepositry;
    private final FileUploadServiceImpl fileUploadService;
    private final ItemRepositry itemRepositry;
    private final ActivityLogService activityLogService;
    @Override
    public CategoryResponse add(CategoryRequest request , MultipartFile file){
        String imgUrl = fileUploadService.uploadFile(file);
        CategoryEntity newCategory = converToEntity(request);
        newCategory.setImgUrl(imgUrl);
        CategoryEntity savedcategory = categoryRepositry.save(newCategory);

        // ✅ Log activity after successful save
        try {
            String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            activityLogService.logActivity(
                    "CATEGORY_CREATED",
                    "Category \"" + savedcategory.getName() + "\" was created",
                    userEmail
            );
        } catch (Exception e) {
            System.err.println("Failed to log category creation activity: " + e.getMessage());
        }

        return converToResponse(savedcategory);
    }
    @Override
    public List<CategoryResponse> read(){
        return categoryRepositry.findAll().
                stream().
                map(categoryEntity -> converToResponse(categoryEntity)).
                collect(Collectors.toList());
    }
    @Override
    public void delete(String categoryId){
        CategoryEntity categoryToDelete = categoryRepositry.findByCategoryId(categoryId).
                orElseThrow(() -> new RuntimeException("Category note found"));
        fileUploadService.deleteFile(categoryToDelete.getImgUrl());
        categoryRepositry.delete(categoryToDelete);

        // ✅ Log activity after successful delete
        try {
            String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            activityLogService.logActivity(
                    "CATEGORY_DELETED",
                    "Category \"" + categoryToDelete.getName() + "\" was deleted",
                    userEmail
            );
        } catch (Exception e) {
            System.err.println("Failed to log category deletion activity: " + e.getMessage());
        }
    }
    public CategoryEntity converToEntity(CategoryRequest request){
        return CategoryEntity.builder().
                categoryId(UUID.randomUUID().toString()).
                name(request.getName()).
                description((request.getDescription())).
                bgColor(request.getBgColor()).build();
    }
    public CategoryResponse converToResponse(CategoryEntity savedcategory){
        Integer itemCount = itemRepositry.countByCategoryId(savedcategory.getId());
        return CategoryResponse.builder().
                categoryId(savedcategory.getCategoryId()).
                name(savedcategory.getName()).
                description((savedcategory.getDescription())).
                bgColor(savedcategory.getBgColor()).
                imgUrl(savedcategory.getImgUrl()).
                createdAt(savedcategory.getCreateAt()).
                updatedAt(savedcategory.getUpdatedAt()).
                item(itemCount).
                build();
    }
}

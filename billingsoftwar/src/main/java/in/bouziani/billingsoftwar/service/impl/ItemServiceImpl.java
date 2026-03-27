package in.bouziani.billingsoftwar.service.impl;

import in.bouziani.billingsoftwar.entity.CategoryEntity;
import in.bouziani.billingsoftwar.entity.ItemEntity;
import in.bouziani.billingsoftwar.io.ItemResponse;
import in.bouziani.billingsoftwar.io.ItemRequest;
import in.bouziani.billingsoftwar.repositry.CategoryRepositry;
import in.bouziani.billingsoftwar.repositry.ItemRepositry;
import in.bouziani.billingsoftwar.service.FileUploadService;
import in.bouziani.billingsoftwar.service.ItemService;
import in.bouziani.billingsoftwar.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {
    private final FileUploadService fileUploadService;
    private final CategoryRepositry categoryRepositry;
    private final ItemRepositry itemRepositry;
    private final ActivityLogService activityLogService;
    @Override
    public ItemResponse add(ItemRequest request, MultipartFile file) {
        String imgUrl = fileUploadService.uploadFile(file);
        ItemEntity newEntity = convertToEntity(request);
        CategoryEntity existingCategory = categoryRepositry.findByCategoryId(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found for that category id : " + request.getCategoryId()));
        newEntity.setCategory(existingCategory);
        newEntity.setImgUrl(imgUrl);
        newEntity = itemRepositry.save(newEntity);

        // ✅ Log activity after successful save
        try {
            String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            activityLogService.logActivity(
                    "ITEM_CREATED",
                    "Item \"" + newEntity.getName() + "\" was created in category \"" + existingCategory.getName() + "\"",
                    userEmail
            );
        } catch (Exception e) {
            System.err.println("Failed to log item creation activity: " + e.getMessage());
        }

        return convertToResponse(newEntity);
    }

    private ItemResponse convertToResponse(ItemEntity newItem) {
        return ItemResponse.builder()
                .itemId(newItem.getItemId())
                .name(newItem.getName())
                .description(newItem.getDescription())
                .price(newItem.getPrice())
                .imgUrl(newItem.getImgUrl())
                .categoryName(newItem.getCategory().getName())
                .categoryId(newItem.getCategory().getCategoryId())
                .createdAt(newItem.getCreatedAt())
                .updatedAt(newItem.getUpdatedAt())
                .build();
    }

    private ItemEntity convertToEntity(ItemRequest request) {
        return ItemEntity.builder()
                .itemId(UUID.randomUUID().toString())
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .build();
    }

    @Override
    public List<ItemResponse> fetchItems() {
        return itemRepositry.findAll()
                .stream()
                .map(itemEntity -> convertToResponse(itemEntity))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteItem(String itemId) {
        ItemEntity existingItem = itemRepositry.findByItemId(itemId)
                .orElseThrow(() -> new RuntimeException("item note found by that id : " + itemId));
        boolean isFile = fileUploadService.deleteFile(existingItem.getImgUrl());
        if(isFile){
            itemRepositry.delete(existingItem);

            // ✅ Log activity after successful delete
            try {
                String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
                activityLogService.logActivity(
                        "ITEM_DELETED",
                        "Item \"" + existingItem.getName() + "\" was deleted",
                        userEmail
                );
            } catch (Exception e) {
                System.err.println("Failed to log item deletion activity: " + e.getMessage());
            }
        }
        else {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR , "Unable to delete image with that url : " + existingItem.getImgUrl());
        }
    }
}

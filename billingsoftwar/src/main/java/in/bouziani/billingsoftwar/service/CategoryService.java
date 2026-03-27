package in.bouziani.billingsoftwar.service;

import in.bouziani.billingsoftwar.io.CategoryRequest;
import in.bouziani.billingsoftwar.io.CategoryResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CategoryService {
    CategoryResponse add(CategoryRequest request , MultipartFile file);
    List<CategoryResponse> read();
    void delete(String categoryId);
}

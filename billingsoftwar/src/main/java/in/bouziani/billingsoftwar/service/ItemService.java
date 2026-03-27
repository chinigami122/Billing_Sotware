package in.bouziani.billingsoftwar.service;

import in.bouziani.billingsoftwar.io.ItemResponse;
import in.bouziani.billingsoftwar.io.ItemRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ItemService {
    ItemResponse add(ItemRequest request , MultipartFile file);
    List<ItemResponse> fetchItems();
    void deleteItem(String itemId);
}

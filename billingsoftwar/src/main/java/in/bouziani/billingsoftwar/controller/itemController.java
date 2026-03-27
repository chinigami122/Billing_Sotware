package in.bouziani.billingsoftwar.controller;

import in.bouziani.billingsoftwar.io.ItemResponse;
import in.bouziani.billingsoftwar.io.ItemRequest;
import in.bouziani.billingsoftwar.repositry.ItemRepositry;
import in.bouziani.billingsoftwar.service.ItemService;
import in.bouziani.billingsoftwar.service.impl.ItemServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class itemController {
    private final ItemService itemService;
    private final ItemRepositry itemRepositry;
    private final ThreadPoolTaskExecutor threadPoolTaskExecutor;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/admin/items")
    public ItemResponse addItem(@RequestPart("item") String itemString ,
                                 @RequestPart("file")MultipartFile file){
        ObjectMapper objectMapper = new ObjectMapper();
        ItemRequest itemRequest = null;
        try{
            itemRequest = objectMapper.readValue(itemString , ItemRequest.class);
            return itemService.add(itemRequest , file);
        }
        catch(JacksonException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Exeption occured while parsing the json");
        }

    }
    @GetMapping("items")
    public List<ItemResponse> readItems(){
        return itemService.fetchItems();
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/admin/{itemId}")
    public void deleteItem(@PathVariable String itemId){
            itemService.deleteItem(itemId);
    }
}
